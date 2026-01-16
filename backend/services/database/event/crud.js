import { supabase } from "../../../config/instances.js";

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
export async function deleteEventById(id) {
  const { error } = await supabase
    .from('events_new')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Error deleting event: ${error.message}`);
  
  return { message: 'Event deleted successfully', id };
}

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

// Link chefs to event in junction table
export async function linkChefsToEvent(eventId, chefIds) {
  if (!chefIds || chefIds.length === 0) return;

  const eventChefLinks = chefIds.map(chefId => ({
    event_id: eventId,
    chef_id: chefId
  }));

  const { error } = await supabase
    .from('event_chefs')
    .insert(eventChefLinks);

  if (error) throw new Error(`Error linking chefs to event: ${error.message}`);
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

// Get events by titles (with embedding IDs for cleanup)
export async function getEventsByTitles(titles) {
  const { data, error } = await supabase
    .from('events_new')
    .select('id, title, embedding_id_en, embedding_id_he')
    .in('title', titles);

  if (error) throw new Error(`Error fetching events: ${error.message}`);
  
  return data || [];
}
