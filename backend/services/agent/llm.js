// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { openai } from '../../config/index.js';
import { generateEmbedding } from '../embeddings/generate.js';
import { searchSimilarDescriptions } from '../database/vector/search.js';

// Function to generate draft details
export async function GenerateDraftDetails(prompt, imageUrl = null) {
  console.log("[AGENT] Prompt: " + prompt);

  // Embed prompt and fetch similar descriptions from pgvector
  const promptEmbedding = await generateEmbedding(prompt);
  const similarDescriptions = await searchSimilarDescriptions(promptEmbedding);
  const examplesBlock = similarDescriptions.map(d => `- "${d}"`).join('\n');
  // Inject examples into instructions before calling OpenAI
  const INSTRUCTIONS = process.env.DRAFT_INSTRUCTIONS + `\n\nHere are examples of past event descriptions in our style:\n${examplesBlock}`
  const content = [
    { type: "input_text", text: `${prompt}\n\nRespond in JSON.` }
  ];

  if (imageUrl) {
    content.push({
      type: "input_image",
      image_url: imageUrl
    });
  }

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [{ role: "user", content }],
    instructions: `${INSTRUCTIONS}`,
    text: { format: { type: "json_object" } }
  });

  console.log("[AGENT] " + response.output_text);
  if (!response.output_text) throw new Error("LLM returned empty output");
  return response.output_text;
}
