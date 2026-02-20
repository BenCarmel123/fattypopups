import { supabase } from "#config/index.js";

// Get all chefs linked to an event
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

// Unlink all chefs from an event (for updates)
export async function unlinkChefsFromEvent(eventId) {
  const { error } = await supabase
    .from('event_chefs')
    .delete()
    .eq('event_id', eventId);

  if (error) throw new Error(`Error unlinking chefs from event: ${error.message}`);
}
