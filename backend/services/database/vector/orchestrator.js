import { generateEmbeddings } from "../../embeddings/generate.js";
import { insertEmbedding, upsertEventEmbeddings } from "./operations.js";
import { updateEventById } from "../entities/event/operations.js";

// Create embeddings for a new event - generate, store, and link to event
// Returns object with embedding IDs or null if failed
export async function createEventEmbeddings(eventId, englishDescription, hebrewDescription, chefNames) {
  console.log('[EMBEDDING] Starting embedding process for event:', eventId);
  
  // 1. Generate embeddings
  const { english: english_embedding, hebrew: hebrew_embedding } = await generateEmbeddings(
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

// Update embeddings for an existing event
export async function updateEventEmbeddings(options) {
  const {
    toPublish,
    alreadyPublished,
    englishChanged,
    hebrewChanged,
    englishDescription,
    hebrewDescription,
    chefNames,
    currentEnglishId,
    currentHebrewId
  } = options;

  let newEnglishEmbedding = null;
  let newHebrewEmbedding = null;

  // 1. GENERATE NEW EMBEDDINGS (IF NEEDED)
  if (toPublish || (alreadyPublished && (englishChanged || hebrewChanged))) {
    const embeddings = await generateEmbeddings(
      englishDescription,
      hebrewDescription,
      toPublish || englishChanged,
      toPublish || hebrewChanged
    );
    
    newEnglishEmbedding = embeddings.english;
    newHebrewEmbedding = embeddings.hebrew;
  }

  // 2. SAVE EMBEDDINGS TO DATABASE
  const { en_id, he_id } = await upsertEventEmbeddings({
    toPublish,
    alreadyPublished,
    englishEmbedding: newEnglishEmbedding,
    hebrewEmbedding: newHebrewEmbedding,
    englishDescription,
    hebrewDescription,
    chefNames,
    currentEnglishId,
    currentHebrewId
  });

  return { en_id, he_id };
}
