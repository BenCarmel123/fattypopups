// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { openai } from '../../config/openai.js';

// Function to embed and store
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

// Function to generate draft details
export async function GenerateDraftDetails(prompt) {
  console.log("[AGENT] Prompt: " + prompt)
   const response = await openai.responses.create({
    model: "gpt-5-nano",
    input: `${prompt}`,
    instructions: `${process.env.DRAFT_INSTRUCTIONS}`,
  });
  console.log("[AGENT] - " + response.output_text)
  if (!response.output_text) throw new Error("LLM returned empty output");
  return response.output_text;
}
