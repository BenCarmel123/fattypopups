import 'dotenv/config';
import { openai } from '../../../../config/index.js';
import { logger } from '../../../../utils/logger.js';
import { buildTextInstructions } from './buildTextInstructions.js';

export async function generateDraftDetails(prompt, styleExamples) {

  const instructions = buildTextInstructions(styleExamples);

  logger.info("[LLM] Calling OpenAI API");
  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: [{ role: "user", content: `${prompt}\n\nRespond in JSON.` }],
    instructions,
    temperature: 0.2,
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
