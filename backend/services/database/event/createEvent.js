import { supabase } from '../../../config/supabase.js';
import { generateEmbedding } from '../../agent/modelCalls.js';

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
    is_draft
  } = body;

  const chefNamesArray = chef_names?.split(',').map(s => s.trim()) ?? [];
  const chefInstagramsArray = chef_instagrams?.split(',').map(s => s.trim()) ?? [];

  const poster = file?.location || null;

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
      poster,
      reservation_url,
      english_description,
      hebrew_description,
      is_draft
    }])
    .select()
    .single();

  if (insertErr) throw new Error(insertErr.message);
  if (is_draft) {
    return newEvent;
  }

  // 3. Generate embeddings
  let english_embedding = null;
  let hebrew_embedding = null;

  try {
    english_embedding = await generateEmbedding(english_description);
    hebrew_embedding = await generateEmbedding(hebrew_description);
  } catch (e) {
    console.log("[ERROR] Embedding error:", e);
  }

  // 4. Insert embeddings
  let embedding_id_en = null;
  let embedding_id_he = null;

  try {
    const { data: enRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'en',
        description: english_description,
        embedding: english_embedding,
      })
      .select()
      .single();

    const { data: heRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'he',
        description: hebrew_description,
        embedding: hebrew_embedding,
      })
      .select()
      .single();

    embedding_id_en = enRow.id;
    embedding_id_he = heRow.id;
  } catch (e) {
    console.log("[ERROR] Error storing embeddings:", e);
  }

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