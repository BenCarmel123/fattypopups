import { generateBothEmbeddings } from "./generate.js";
import { insertEmbedding } from "./operations.js";
import { updateEventById } from "../event/operations.js";

// Process embeddings for an event - generate, store, and link to event
// Returns object with embedding IDs or null if failed
export async function processEventEmbeddings(eventId, englishDescription, hebrewDescription, chefNames) {
  console.log('[EMBEDDING] Starting embedding process for event:', eventId);
  
  // 1. Generate embeddings
  const { english: english_embedding, hebrew: hebrew_embedding } = await generateBothEmbeddings(
    englishDescription,
    hebrewDescription
  );

  if (!english_embedding || !hebrew_embedding) {
    console.log("[ERROR] Failed to generate embeddings");
    return { embedding_id_en: null, embedding_id_he: null };
  }

  // 2. Insert embeddings into database
  let embedding_id_en = null;
  let embedding_id_he = null;

  try {
    const enRow = await insertEmbedding('en', englishDescription, english_embedding, chefNames);
    const heRow = await insertEmbedding('he', hebrewDescription, hebrew_embedding, chefNames);

    embedding_id_en = enRow.id;
    embedding_id_he = heRow.id;
  } catch (e) {
    console.log("[ERROR] Error storing embeddings:", e);
    return { embedding_id_en: null, embedding_id_he: null };
  }

  // 3. Update event with embedding IDs
  try {
    await updateEventById(eventId, {
      embedding_id_en,
      embedding_id_he,
    });
  } catch (e) {
    console.log("[ERROR] Error updating event with embedding IDs:", e);
  }

  return { embedding_id_en, embedding_id_he };
}
