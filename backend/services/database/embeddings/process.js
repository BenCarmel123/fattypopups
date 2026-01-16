import { supabase } from "../../../config/instances.js";
import { generateEmbedding } from "./api.js";

// Process embeddings for an event - generate, store, and link to event
// Returns object with embedding IDs or null if failed
export async function processEventEmbeddings(eventId, englishDescription, hebrewDescription, chefNames) {
  // 1. Generate embeddings
  let english_embedding = null;
  let hebrew_embedding = null;

  try {
    english_embedding = await generateEmbedding(englishDescription);
    hebrew_embedding = await generateEmbedding(hebrewDescription);
  } catch (e) {
    console.log("[ERROR] Embedding generation error:", e);
    return { embedding_id_en: null, embedding_id_he: null };
  }

  // 2. Insert embeddings into database
  let embedding_id_en = null;
  let embedding_id_he = null;

  try {
    const { data: enRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNames,
        language: 'en',
        description: englishDescription,
        embedding: english_embedding,
      })
      .select()
      .single();

    const { data: heRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNames,
        language: 'he',
        description: hebrewDescription,
        embedding: hebrew_embedding,
      })
      .select()
      .single();

    embedding_id_en = enRow.id;
    embedding_id_he = heRow.id;
  } catch (e) {
    console.log("[ERROR] Error storing embeddings:", e);
    return { embedding_id_en: null, embedding_id_he: null };
  }

  // 3. Update event with embedding IDs
  try {
    await supabase
      .from('events_new')
      .update({
        embedding_id_en,
        embedding_id_he,
      })
      .eq('id', eventId);
  } catch (e) {
    console.log("[ERROR] Error updating event with embedding IDs:", e);
  }

  return { embedding_id_en, embedding_id_he };
}
