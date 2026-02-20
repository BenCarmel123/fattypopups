// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { openai } from '../../config/index.js';
import { logger } from "../../utils/logger.js";

// Function to generate draft details
export async function GenerateDraftDetails(prompt) {
  logger.info("[AGENT] Prompt: " + prompt)
   const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `${prompt}`,
    instructions: `${process.env.DRAFT_INSTRUCTIONS}`,
  });
  logger.info("[AGENT] " + response.output_text)
  if (!response.output_text) throw new Error("LLM returned empty output");
  return response.output_text;
}
