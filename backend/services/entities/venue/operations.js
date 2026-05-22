import { supabase, TABLES } from "#config/index.js";
import { normalizeVenueName } from "../utils/parse.js";
import { withRetry, RETRY_PROFILES } from "../../../utils/retry/index.js";

export async function getVenueById(id) {
  if (!id) return null;

  const { data, error } = await withRetry(() => supabase
    .from(TABLES.VENUES)
    .select("*")
    .eq("id", id)
    .single(), RETRY_PROFILES.SUPABASE_READ);

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error finding venue: ${error.message}`);
  }

  return data || null;
}

export async function getVenueByName(name) {
  if (!name) return null;

  const normalizedName = normalizeVenueName(name);

  const { data, error } = await withRetry(() => supabase
    .from(TABLES.VENUES)
    .select("*")
    .eq("name", normalizedName)
    .single(), RETRY_PROFILES.SUPABASE_READ);

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

  const { data, error } = await withRetry(() => supabase
    .from(TABLES.VENUES)
    .insert([{ name: normalizedName, address, instagram_handle }])
    .select()
    .single(), RETRY_PROFILES.SUPABASE_WRITE);

  if (error) throw new Error(`Error creating venue: ${error.message}`);

  return data;
}

export async function getAllVenues() {
  const { data, error } = await withRetry(() => supabase
    .from(TABLES.VENUES)
    .select('name, address, instagram_handle')
    .order('name'), RETRY_PROFILES.SUPABASE_READ);

  if (error) throw new Error(`Error fetching venues: ${error.message}`);

  return data;
}

export async function findSimilarVenue(name) {
  const normalizedName = normalizeVenueName(name);
  const { data, error } = await withRetry(() => supabase.rpc('find_similar_venue', { input_name: normalizedName, threshold: 0.6 }), RETRY_PROFILES.SUPABASE_READ);
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
