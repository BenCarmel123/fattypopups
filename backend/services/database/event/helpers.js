import { supabase } from "../../../config/instances.js";

// Insert a new event into events_new table
// Returns the newly created event object
export async function insertEvent(eventData) {
  const { data: newEvent, error: insertErr } = await supabase
    .from('events_new')
    .insert([eventData])
    .select()
    .single();

  if (insertErr) throw new Error(insertErr.message);
  
  return newEvent;
}
