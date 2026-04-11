import 'dotenv/config';
import { openai } from '../../../../config/index.js';
import { logger } from '../../../../utils/logger.js';
import { buildTextInstructions } from './buildTextInstructions.js';
import { DRAFT_SCHEMA } from '../../../../schemas/openai.schema.js';

export async function generateDraftDetails(prompt, styleExamples) {

  const instructions = buildTextInstructions(styleExamples);

  const requestParams = {
    model: "gpt-5.4",
    input: [{ role: "user", content: prompt }],
    instructions,
    reasoning: { effort: "high" },
    text: { format: DRAFT_SCHEMA, verbosity: "low" }
  };

  logger.info("[LLM] Calling OpenAI API with Text");
  const response = await openai.responses.create(requestParams);

  logger.info("[LLM] " + response.output_text);
  if (!response.output_text) throw new Error("LLM returned empty output");

  try {
    return JSON.parse(response.output_text);
  } catch (parseError) {
    logger.error("[LLM] Failed to parse LLM output as JSON:", response.output_text);
    throw new Error("LLM returned invalid JSON");
  }
}
