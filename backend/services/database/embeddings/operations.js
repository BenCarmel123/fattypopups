import { supabase } from "../../../config/instances.js";

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
    console.log("[EMBEDDING] Inserting new embeddings for published event...");
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
      
      console.log("[EMBEDDING] Successfully inserted embeddings - EN ID:", en_id, "| HE ID:", he_id);

    } catch (e) {
      console.log("[ERROR] Error inserting embeddings:", e);
    }
  }

  // [UPDATE] When updating already published event
  if (alreadyPublished) {
    console.log("[EMBEDDING] Updating existing embeddings...");
    try {
      if (englishEmbedding) {
        await updateEmbeddingById(
          currentEnglishId,
          englishDescription,
          englishEmbedding
        );
        console.log("[EMBEDDING] Updated English embedding ID:", currentEnglishId);
      }
      if (hebrewEmbedding) {
        await updateEmbeddingById(
          currentHebrewId,
          hebrewDescription,
          hebrewEmbedding
        );
        console.log("[EMBEDDING] Updated Hebrew embedding ID:", currentHebrewId);
      }
      console.log("[EMBEDDING] Successfully updated embeddings");
    } catch (e) {
      console.log("[ERROR] Error updating embeddings:", e);
    }
  }

  return { en_id, he_id };
}
