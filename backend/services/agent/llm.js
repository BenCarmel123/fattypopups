// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { openai } from '../../config/index.js';
import { generateEmbedding } from '../embeddings/generate.js';
import { searchSimilarDescriptions } from '../embeddings/search.js';
import { logger } from '../../utils/logger.js';
import { DRAFT_INSTRUCTIONS } from './draft-instructions.js';

// Function to generate draft details
export async function generateDraftDetails(prompt, posterUrl = null, contextUrl = null) {

  // Embed prompt and fetch similar descriptions from pgvector
  const promptEmbedding = await generateEmbedding(prompt);
  const similarDescriptions = await searchSimilarDescriptions(promptEmbedding);
  const examplesBlock = similarDescriptions.map(d => `- "${d}"`).join('\n');
  // Inject examples into instructions before calling OpenAI
  const today = new Date().toISOString().split('T')[0];
  const INSTRUCTIONS = DRAFT_INSTRUCTIONS + `\n\nToday's date is ${today}.\n\nHere are examples of past event descriptions in our style:\n${examplesBlock}`
  const content = [
    { type: "input_text", text: `${prompt}\n\nRespond in JSON.` }
  ];

  if (posterUrl) {
    content.push({ type: "input_image", image_url: posterUrl });
  }
  if (contextUrl) {
    content.push({ type: "input_image", image_url: contextUrl });
  }

  logger.info("[AGENT] Calling OpenAI API");
  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: [{ role: "user", content }],
    instructions: `${INSTRUCTIONS}`,
    temperature: 0.3,
    text: { format: { type: "json_object" } }
  });

  logger.info("[AGENT] OpenAI response received");
  logger.info("[AGENT] " + response.output_text);
  if (!response.output_text) throw new Error("LLM returned empty output");
  return response.output_text;
}
