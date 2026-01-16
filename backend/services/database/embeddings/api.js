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

