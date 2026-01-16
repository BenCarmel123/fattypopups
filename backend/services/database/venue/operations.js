import { supabase } from "../../../config/instances.js";
import { normalizeVenueName } from "../utils/parse.js";

// Check if venue exists by name
// Returns the venue object if found, null otherwise
export async function getVenueByName(name) {
  if (!name) return null;

  const normalizedName = normalizeVenueName(name);

  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .eq("name", normalizedName)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    throw new Error(`Error finding venue: ${error.message}`);
  }

  return data || null;
}

// Create a new venue
export async function createVenue(name, address, instagram_handle) {
  if (!name || !address || !instagram_handle) {
    throw new Error("Venue name, address, and instagram_handle are required");
  }

  const normalizedName = normalizeVenueName(name);

  const { data, error } = await supabase
    .from("venues")
    .insert([{ name: normalizedName, address, instagram_handle }])
    .select()
    .single();

  if (error) throw new Error(`Error creating venue: ${error.message}`);
  
  return data;
}

// Process venue data - get existing or create new
// Returns venue ID (does not update existing venue from user input)
export async function processVenue(venueName, venueAddress, venueInstagram) {
  if (!venueName || !venueAddress || !venueInstagram) {
    throw new Error("Venue name, address, and instagram_handle are required");
  }

  let venue = await getVenueByName(venueName);
  
  if (!venue) {
    // Create new venue only if doesn't exist
    venue = await createVenue(venueName, venueAddress, venueInstagram);
  }
  // If venue exists, use existing data (don't update from user input)
  
  return venue.id;
}
