// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { openai } from '../../../config/index.js';
import { logger } from '../../../utils/logger.js';
import { buildInstructions } from './buildInstructions.js';

export async function generateDraftDetails(prompt, posterUrl = null, contextUrl = null) {

  const instructions = await buildInstructions(prompt);
  const content = [
    { type: "input_text", text: `${prompt}\n\nRespond in JSON.` }
  ];

  if (posterUrl) {
    content.push({ type: "input_image", image_url: posterUrl });
  }
  if (contextUrl) {
    content.push({ type: "input_image", image_url: contextUrl });
  }

  logger.info("[LLM] Calling OpenAI API");
  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: [{ role: "user", content }],
    instructions,
    temperature: 0.3,
    text: { format: { type: "json_object" } }
  });

  logger.info("[LLM] " + response.output_text);
  if (!response.output_text) throw new Error("LLM returned empty output");

  try {
    return JSON.parse(response.output_text);
  } catch (parseError) {
    logger.error("[LLM] Failed to parse LLM output as JSON:", response.output_text);
    throw new Error("LLM returned invalid JSON");
  }
}
