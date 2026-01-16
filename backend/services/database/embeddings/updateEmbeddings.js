import { generateChangedEmbeddings } from "./generate.js";
import { upsertEventEmbeddings } from "./operations.js";

// Handle full embedding update workflow for event updates
export async function handleEventEmbeddingsUpdate(options) {
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
    const embeddings = await generateChangedEmbeddings(
      toPublish || englishChanged,
      toPublish || hebrewChanged,
      englishDescription,
      hebrewDescription
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
