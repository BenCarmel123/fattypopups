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

// Wrapper function to generate embeddings based on what changed
export async function generateChangedEmbeddings(englishChanged, hebrewChanged, englishDescription, hebrewDescription) {
  console.log('[EMBEDDING] Starting embedding generation...');
  console.log('[EMBEDDING] English changed:', englishChanged, '| Hebrew changed:', hebrewChanged);
  
  const result = {
    english: null,
    hebrew: null
  };

  try {
    // Generate English embedding if it changed
    if (englishChanged) {
      console.log('[EMBEDDING] Generating English embedding...');
      result.english = await generateEmbedding(englishDescription);
      console.log('[EMBEDDING] English embedding generated:', result.english ? 'SUCCESS' : 'NULL');
    }

    // Generate Hebrew embedding if it changed
    if (hebrewChanged) {
      console.log('[EMBEDDING] Generating Hebrew embedding...');
      result.hebrew = await generateEmbedding(hebrewDescription);
      console.log('[EMBEDDING] Hebrew embedding generated:', result.hebrew ? 'SUCCESS' : 'NULL');
    }
  } catch (e) {
    console.log("[ERROR] Embedding generation error:", e);
    console.log("[ERROR] Error details:", e.message, e.stack);
  }

  return result;
}

// Generate both English and Hebrew embeddings (always generates both)
export async function generateBothEmbeddings(englishDescription, hebrewDescription) {
  console.log('[EMBEDDING] Starting embedding generation...');
  
  let english = null;
  let hebrew = null;

  try {
    console.log('[EMBEDDING] Generating English embedding...');
    english = await generateEmbedding(englishDescription);
    console.log('[EMBEDDING] English embedding generated:', english ? 'SUCCESS' : 'NULL');
    
    console.log('[EMBEDDING] Generating Hebrew embedding...');
    hebrew = await generateEmbedding(hebrewDescription);
    console.log('[EMBEDDING] Hebrew embedding generated:', hebrew ? 'SUCCESS' : 'NULL');
  } catch (e) {
    console.log("[ERROR] Embedding generation error:", e);
    console.log("[ERROR] Error details:", e.message, e.stack);
  }

  return { english, hebrew };
}
