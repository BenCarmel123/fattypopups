import { openai } from "../../../config/instances.js";

// Function to generate embedding using OpenAI API
export async function generateEmbedding(description) {
  if (!openai) {
    console.warn("OpenAI client is not initialized. Skipping embedding creation.");
    return null; // Return a fallback value or handle gracefully
  }
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: description,
  });
  const embedding = embeddingResponse.data[0].embedding;
  return embedding;
}

// Generate embeddings for English and/or Hebrew descriptions in parallel
// Pass true/false for each language to control what gets generated
// If no flags provided, generates both by default
export async function generateEmbeddings(englishDescription, hebrewDescription, generateEnglish = true, generateHebrew = true) {
  console.log(`[EMBEDDING] Starting embedding generation - English: ${generateEnglish} | Hebrew: ${generateHebrew}`);
  
  const result = {
    english: null,
    hebrew: null
  };

  try {
    // Build array of promises for parallel execution
    const promises = [];
    
    if (generateEnglish) {
      promises.push(
        generateEmbedding(englishDescription).then(embedding => ({ type: 'english', embedding }))
      );
    }
    
    if (generateHebrew) {
      promises.push(
        generateEmbedding(hebrewDescription).then(embedding => ({ type: 'hebrew', embedding }))
      );
    }

    // Execute all generations in parallel
    if (promises.length > 0) {
      const results = await Promise.all(promises);
      
      // Map results back to their respective languages
      results.forEach(({ type, embedding }) => {
        result[type] = embedding;
        const status = embedding ? 'SUCCESS' : 'NULL';
        const lang = type === 'english' ? 'English' : 'Hebrew';
        console.log(`[EMBEDDING] ${lang} embedding generated:`, status);
      });
    }
  } catch (e) {
    console.log(`[ERROR] Embedding generation error: ${e.message}`, e.stack);
  }

  return result;
}

// Backwards compatibility aliases
export const generateBothEmbeddings = (en, he) => generateEmbeddings(en, he, true, true);
export const generateChangedEmbeddings = (enChanged, heChanged, en, he) => generateEmbeddings(en, he, enChanged, heChanged);
