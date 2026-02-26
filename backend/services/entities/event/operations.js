import { supabase } from "#config/index.js";
import { upsertVenue } from "../venue/operations.js";
import { logger } from "../../../utils/logger.js";

// Insert a new event into the events_new table
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
    is_draft
  } = eventData;

  const { data, error } = await supabase
    .from('events_new')
    .insert([{
      title,
      start_datetime,
      end_datetime,
      venue_id,
      poster,
      reservation_url,
      english_description,
      hebrew_description,
      is_draft
    }])
    .select()
    .single();

  if (error) throw new Error(`Error creating event: ${error.message}`);

  return data;
}

// Get event by ID
export async function getEventById(id, fields = '*') {
  const { data, error } = await supabase
    .from('events_new')
    .select(fields)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Error finding event: ${error.message}`);
  }

  return data || null;
}

// Update event
export async function updateEventById(id, updates) {
  const { data, error } = await supabase
    .from('events_new')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating event: ${error.message}`);

  return data;
}

// Delete event
// Get all events with relations
export async function getAllEventsWithRelations(isAdmin = false) {
  let query = supabase
    .from("events_new")
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

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching events: ${error.message}`);
  }

  return data;
}

// Get poster URLs for events by titles
export async function getImageUrlsByTitles(titles) {
  const { data, error } = await supabase
    .from('events_new')
    .select('poster')
    .in('title', titles);

  if (error) throw new Error(`Error fetching image URLs: ${error.message}`);

  return data.map(row => row.poster);
}

// Delete events by titles
export async function deleteEventsByTitles(titles) {
  const { error } = await supabase
    .from('events_new')
    .delete()
    .in('title', titles);

  if (error) throw new Error(`Error deleting events: ${error.message}`);

  return { message: 'Events deleted successfully', deleted: titles };
}

// Handle venue updates - only update if venue changed or publishing draft
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
