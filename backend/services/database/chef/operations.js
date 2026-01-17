import { supabase } from "../../../config/instances.js";
import { normalizeChefName } from "../utils/parse.js";

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

export async function getChefsForEvent(eventId) {
  const { data, error } = await supabase
    .from("event_chefs")
    .select("chef:chefs(id, name, instagram_handle)")
    .eq("event_id", eventId);

  if (error) {
    throw new Error(`Error fetching chefs for event: ${error.message}`);
  }

  // Flatten the nested chef objects
  return data?.map(item => item.chef) || [];
}

// Unlink all chefs from an event (for updates)
export async function unlinkChefsFromEvent(eventId) {
  const { error } = await supabase
    .from('event_chefs')
    .delete()
    .eq('event_id', eventId);

  if (error) throw new Error(`Error unlinking chefs from event: ${error.message}`);
}

// Handle chef relationship updates - only update if chefs changed or publishing draft
export async function handleEventChefsUpdate({ chefNames, chefInstagrams, toPublish, chefsChanged }) {
  const shouldUpdate = toPublish || chefsChanged;

  if (!shouldUpdate) {
    console.log('[CHEFS] No chef update needed');
    return;
  }

  console.log('[CHEFS] Processing chef updates');

  // Get or create chefs, returns array of chef IDs
  const chefIds = await upsertChefs(chefNames, chefInstagrams);

  // TODO: Update junction table relationships
  // await unlinkChefsFromEvent(eventId);
  // await linkChefsToEvent(eventId, chefIds);

  console.log('[CHEFS] Chefs processed, IDs:', chefIds);
}