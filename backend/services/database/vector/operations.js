import { supabase } from "#config/index.js";
import { logger } from "../../../utils/logger.js";

// Insert a single embedding into the database
export async function insertEmbedding(language, description, embedding, chefNames) {
  const { data, error } = await supabase
    .from('embeddings')
    .insert({
      chef_names: chefNames,
      language: language,
      description: description,
      embedding: embedding,
    })
    .select()
    .single();

  if (error) throw new Error(`Error inserting embedding: ${error.message}`);
  
  return data;
}

// Update an existing embedding
export async function updateEmbeddingById(id, description, embedding) {
  const { data, error } = await supabase
    .from('embeddings')
    .update({
      description: description,
      embedding: embedding
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Error updating embedding: ${error.message}`);
  
  return data;
}

// Get embedding by ID
// Insert or update embeddings when publishing/updating events
export async function upsertEventEmbeddings(options) {
  const {
    toPublish,
    alreadyPublished,
    englishEmbedding,
    hebrewEmbedding,
    englishDescription,
    hebrewDescription,
    chefNames,
    currentEnglishId,
    currentHebrewId
  } = options;

  let en_id = null;
  let he_id = null;

  // [INSERT] When publishing a draft for the first time
  if (toPublish) {
    logger.info("[EMBEDDING] Inserting new embeddings for published event...");
    try {
      const enRow = await insertEmbedding(
        'en',
        englishDescription,
        englishEmbedding,
        chefNames
      );

      const heRow = await insertEmbedding(
        'he',
        hebrewDescription,
        hebrewEmbedding,
        chefNames
      );

      en_id = enRow.id;
      he_id = heRow.id;

      logger.info("[EMBEDDING] Successfully inserted embeddings - EN ID:", en_id, "| HE ID:", he_id);

    } catch (e) {
      logger.error("Error inserting embeddings:", e);
      return { en_id: null, he_id: null, embeddingError: true };
    }
  }

  // [UPDATE] When updating already published event
  if (alreadyPublished) {
    logger.info("[EMBEDDING] Updating existing embeddings...");
    try {
      if (englishEmbedding) {
        await updateEmbeddingById(
          currentEnglishId,
          englishDescription,
          englishEmbedding
        );
      }
      if (hebrewEmbedding) {
        await updateEmbeddingById(
          currentHebrewId,
          hebrewDescription,
          hebrewEmbedding
        );
      }
      logger.info(`[EMBEDDING] Successfully updated embeddings - EN ID: ${englishEmbedding ? currentEnglishId : 'unchanged'} | HE ID: ${hebrewEmbedding ? currentHebrewId : 'unchanged'}`);
    } catch (e) {
      logger.error("Error updating embeddings:", e);
      return { en_id, he_id, embeddingError: true };
    }
  }

  return { en_id, he_id };
}
