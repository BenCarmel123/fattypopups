import 'dotenv/config';
import { openai } from '../../../../config/index.js';
import { logger } from '../../../../utils/logger.js';
import { buildTextInstructions } from './buildTextInstructions.js';
import { DRAFT_SCHEMA } from '../../../../schemas/openai.schema.js';
import { llmCall } from '../../../llm/llmCall.js';

export async function generateDraftDetails(prompt, styleExamples) {

  const instructions = buildTextInstructions(styleExamples);

  const model = "gpt-5.5";
  const requestParams = {
    model,
    input: [{ role: "user", content: prompt }],
    instructions,
    reasoning: { effort: "high" },
    text: { format: DRAFT_SCHEMA, verbosity: "low" }
  };

  const textCall = () => openai.responses.create(requestParams);

  const response = await llmCall(textCall, { callType: 'text', model, prompt });

  if (!response.output_text) throw new Error("LLM returned empty output");

  try {
    return JSON.parse(response.output_text);
  } catch (parseError) {
    logger.error("[LLM] Failed to parse LLM output as JSON:", response.output_text);
    throw new Error("LLM returned invalid JSON");
  }
}
