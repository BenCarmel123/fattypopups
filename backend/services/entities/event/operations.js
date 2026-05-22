import { supabase, TABLES } from "#config/index.js";
import { upsertVenue } from "../venue/operations.js";
import { logger } from "../../../utils/logger.js";
import { withRetry, RETRY_PROFILES } from "../../../utils/retry/index.js";

export async function insertEvent(eventData) {
  const {
    title,
    start_datetime,
    end_datetime,
    venue_id,
    poster,
    reservation_url,
    english_description,
    hebrew_description,
    is_draft,
    metadata,
    status
  } = eventData;

  const { data, error } = await withRetry(() => supabase
    .from(TABLES.EVENTS)
    .insert([{
      title,
      start_datetime,
      end_datetime,
      venue_id,
      poster,
      reservation_url,
      english_description,
      hebrew_description,
      is_draft,
      metadata,
      status
    }])
    .select()
    .single(), RETRY_PROFILES.SUPABASE_WRITE);

  if (error) throw new Error(`Error creating event: ${error.message}`);

  return data;
}

export async function getEventById(id, fields = '*') {
  const { data, error } = await withRetry(() => supabase
    .from(TABLES.EVENTS)
    .select(fields)
    .eq('id', id)
    .single(), RETRY_PROFILES.SUPABASE_READ);

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error finding event: ${error.message}`);
  }

  return data || null;
}

export async function updateEventById(id, updates) {
  const { data, error } = await withRetry(() => supabase
    .from(TABLES.EVENTS)
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      venue:venues(id, name, address, instagram_handle),
      event_chefs(
        chef:chefs(id, name, instagram_handle)
      )
    `)
    .single(), RETRY_PROFILES.SUPABASE_WRITE);

  if (error) throw new Error(`Error updating event: ${error.message}`);

  return {
    ...data,
    venue: {
      name: data.venue?.name || '',
      address: data.venue?.address || '',
      instagram_handle: data.venue?.instagram_handle || '',
    },
    chefs: (data.event_chefs || [])
      .map(ec => ({ name: ec.chef?.name || '', instagram_handle: ec.chef?.instagram_handle || '' }))
      .filter(chef => chef.name),
  };
}

export async function getAllEventsWithRelations(isAdmin = false) {
  let query = supabase
    .from(TABLES.EVENTS)
    .select(`
      *,
      venue:venues(id, name, address, instagram_handle),
      event_chefs(
        chef:chefs(id, name, instagram_handle)
      )
    `)
    .order("is_draft", { ascending: true })
    .order("start_datetime", { ascending: true });

  if (!isAdmin) {
    query = query.eq("is_draft", false);
  }

  const { data, error } = await withRetry(() => query.then(res => res), RETRY_PROFILES.SUPABASE_READ);

  if (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }

  return data;
}

export async function getImageUrlsByTitles(titles) {
  const { data, error } = await withRetry(() => supabase
    .from(TABLES.EVENTS)
    .select('poster')
    .in('title', titles), RETRY_PROFILES.SUPABASE_READ);

  if (error) throw new Error(`Error fetching image URLs: ${error.message}`);

  return data.map(row => row.poster);
}

export async function getImageUrlById(id) {
  const { data, error } = await withRetry(() => supabase
    .from(TABLES.EVENTS)
    .select('poster')
    .eq('id', id)
    .single(), RETRY_PROFILES.SUPABASE_READ);

  if (error && error.code !== 'PGRST116') throw new Error(`Error fetching image URL: ${error.message}`);

  return data?.poster || null;
}

export async function deleteEventById(id) {
  const { error } = await withRetry(() => supabase
    .from(TABLES.EVENTS)
    .delete()
    .eq('id', id), RETRY_PROFILES.SUPABASE_WRITE);

  if (error) throw new Error(`Error deleting event: ${error.message}`);

  return { message: 'Event deleted successfully', deleted: id };
}

export async function getPastEvents() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 2);

  const { data, error } = await withRetry(() => supabase
    .from(TABLES.EVENTS)
    .select('id, title')
    .lt('end_datetime', cutoff.toISOString()), RETRY_PROFILES.SUPABASE_READ);

  if (error) throw new Error(`Error fetching past events: ${error.message}`);

  return data;
}

export async function handleEventVenueUpdate({ eventId, venueName, venueAddress, venueInstagram, shouldUpdate }) {
  if (!shouldUpdate) {
    logger.info('[VENUE] No venue update needed (draft mode or no changes to published event)');
    return null;
  }

  logger.info('[VENUE] Processing venue update...');

  // Get or create venue, returns venue_id
  const venueId = await upsertVenue(venueName, venueAddress, venueInstagram);

  logger.info(`[VENUE] Venue processed - ID: ${venueId}`);
  return venueId;
}
