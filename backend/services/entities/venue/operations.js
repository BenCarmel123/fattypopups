import { supabase, TABLES } from "#config/index.js";
import { normalizeVenueName } from "../utils/parse.js";

export async function getVenueById(id) {
  if (!id) return null;

  const { data, error } = await supabase
    .from(TABLES.VENUES)
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== 'PGRST116') { 
    throw new Error(`Error finding venue: ${error.message}`);
  }

  return data || null;
}

export async function getVenueByName(name) {
  if (!name) return null;

  const normalizedName = normalizeVenueName(name);

  const { data, error } = await supabase
    .from(TABLES.VENUES)
    .select("*")
    .eq("name", normalizedName)
    .single();

  if (error && error.code !== 'PGRST116') { 
    throw new Error(`Error finding venue: ${error.message}`);
  }

  return data || null;
}

export async function createVenue(name, address, instagram_handle) {
  if (!name || !address || !instagram_handle) {
    throw new Error("Venue name, address, and instagram_handle are required");
  }

  const normalizedName = normalizeVenueName(name);

  const { data, error } = await supabase
    .from(TABLES.VENUES)
    .insert([{ name: normalizedName, address, instagram_handle }])
    .select()
    .single();

  if (error) throw new Error(`Error creating venue: ${error.message}`);

  return data;
}

export async function getAllVenues() {
  const { data, error } = await supabase
    .from(TABLES.VENUES)
    .select('name, address, instagram_handle')
    .order('name');

  if (error) throw new Error(`Error fetching venues: ${error.message}`);

  return data;
}

export async function findSimilarVenue(name) {
  const normalizedName = normalizeVenueName(name);
  const { data, error } = await supabase.rpc('find_similar_venue', { input_name: normalizedName, threshold: 0.6 });
  if (error) throw new Error(`Error finding similar venue: ${error.message}`);
  return data?.[0] || null;
}

export async function upsertVenue(venueName, venueAddress, venueInstagram) {
  if (!venueName || !venueAddress || !venueInstagram) {
    throw new Error("Venue name, address, and instagram_handle are required");
  }

  let venue = await getVenueByName(venueName);

  if (!venue) {
    venue = await findSimilarVenue(venueName);
  }

  if (!venue) {
    venue = await createVenue(venueName, venueAddress, venueInstagram);
  }

  return venue.id;
}
