import { supabase } from "#config/index.js";
import { normalizeChefName } from "../utils/parse.js";
import { unlinkChefsFromEvent, linkChefsToEvent } from "../linking/operations.js";
import { logger } from "../../../../utils/logger.js";

// Check if chef exists by name
// Returns the chef object if found, null otherwise
export async function getChefByName(name) {
  if (!name) return null;

  const normalizedName = normalizeChefName(name);

  const { data, error } = await supabase
    .from("chefs")
    .select("*")
    .eq("name", normalizedName)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    throw new Error(`Error finding chef: ${error.message}`);
  }

  return data || null;
}

// Create a new chef
export async function createChef(name, instagram_handle) {
  if (!name || !instagram_handle) {
    throw new Error("Chef name and instagram_handle are required");
  }

  const normalizedName = normalizeChefName(name);

  const { data, error } = await supabase
    .from("chefs")
    .insert([{ name: normalizedName, instagram_handle }])
    .select()
    .single();

  if (error) throw new Error(`Error creating chef: ${error.message}`);

  return data;
}

// Upsert multiple chefs from comma-separated strings
// Returns array of chef IDs (creates new chefs only if they don't exist)
export async function upsertChefs(chefNamesString, chefInstagramsString) {
  const chefNamesArray = chefNamesString?.split(',').map(s => s.trim()).filter(Boolean) ?? [];
  const chefInstagramsArray = chefInstagramsString?.split(',').map(s => s.trim()).filter(Boolean) ?? [];

  if (chefNamesArray.length !== chefInstagramsArray.length) {
    throw new Error("Chef names and instagrams must match in length");
  }

  const chefIds = [];

  for (let i = 0; i < chefNamesArray.length; i++) {
    const name = chefNamesArray[i];
    const instagram = chefInstagramsArray[i];

    let chef = await getChefByName(name);

    if (!chef) {
      // Create new chef only if doesn't exist
      chef = await createChef(name, instagram);
    }
    // If chef exists, use existing data (don't update from user input)

    chefIds.push(chef.id);
  }

  return chefIds;
}

// Get all chefs from database
export async function getAllChefs() {
  const { data, error } = await supabase
    .from('chefs')
    .select('name, instagram_handle')
    .order('name');

  if (error) throw new Error(`Error fetching chefs: ${error.message}`);

  return data;
}

// Handle chef relationship updates - only update if chefs changed or publishing draft
export async function handleEventChefsUpdate({ eventId, chefNames, chefInstagrams, shouldUpdate, shouldUnlink }) {
  if (!shouldUpdate) {
    logger.info('[CHEFS] No chef update needed (draft mode or no changes to published event)');
    return;
  }

  logger.info('[CHEFS] Processing chef updates...');

  // Get or create chefs, returns array of chef IDs
  const chefIds = await upsertChefs(chefNames, chefInstagrams);

  // Unlink existing chefs if updating already-published event
  if (shouldUnlink) {
    await unlinkChefsFromEvent(eventId);
  }

  // Link new/updated chefs
  await linkChefsToEvent(eventId, chefIds);
  logger.info(`[CHEFS] ${shouldUnlink ? 'Unlinked old chefs and linked' : 'Linked'} new chefs - Chef IDs: ${chefIds.join(', ')}`);
}