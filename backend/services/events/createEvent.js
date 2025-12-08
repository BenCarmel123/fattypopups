import { supabase } from '../../config/supabaseClient.js';

export const createEvent = async (body, file) => {
  const {
    title,
    start_datetime,
    end_datetime,
    venue_instagram,
    venue_address,
    chef_names,
    chef_instagrams,
    reservation_url,
    english_description,
    hebrew_description,
  } = body;

  const chefNamesArray = chef_names?.split(',').map(s => s.trim()) ?? [];
  const chefInstagramsArray = chef_instagrams?.split(',').map(s => s.trim()) ?? [];

  const image_url = file?.location || null;

  // 1. Duplicate check
  const { data: dup, error: dupErr } = await supabase
    .from('events')
    .select("*")
    .eq('title', title)
    .eq('start_datetime', start_datetime)
    .eq('end_datetime', end_datetime);

  if (dupErr) throw new Error(dupErr.message);
  if (dup.length > 0) throw new Error("Event already exists.");

  // 2. Insert event
  const { data: newEvent, error: insertErr } = await supabase
    .from('events')
    .insert([{
      title,
      start_datetime,
      end_datetime,
      venue_instagram,
      venue_address,
      chef_names: chefNamesArray,
      chef_instagrams: chefInstagramsArray,
      image_url,
      reservation_url,
      english_description,
      hebrew_description,
    }])
    .select()
    .single();

  if (insertErr) throw new Error(insertErr.message);

  // 5. Update event with IDs
  await supabase
    .from('events')
    .update({
      embedding_id_en,
      embedding_id_he,
    })
    .eq('id', newEvent.id);

  return newEvent;
};