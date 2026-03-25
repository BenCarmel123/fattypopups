import 'dotenv/config';
import { openai } from '../../../../config/index.js';
import { logger } from '../../../../utils/logger.js';
import { buildTextInstructions } from './buildTextInstructions.js';

const DRAFT_SCHEMA = {
  type: "json_schema",
  name: "draft",
  strict: true,
  schema: {
    type: "object",
    properties: {
      chef_names: { type: "array", items: { type: "string" } },
      venue_name: { type: "string" },
      event_title: { type: "string" },
      english_description: { type: "string" },
      hebrew_description: { type: "string" },
      start_datetime: { type: "string" },
      end_datetime: { type: "string" }
    },
    required: ["chef_names", "venue_name", "event_title", "english_description", "hebrew_description", "start_datetime", "end_datetime"],
    additionalProperties: false
  }
};

export async function generateDraftDetails(prompt, styleExamples, visionResponseId = null) {

  const instructions = buildTextInstructions(styleExamples);

  const requestParams = {
    model: "gpt-5.4",
    input: [{ role: "user", content: prompt }],
    instructions,
    reasoning: { effort: "none" },
    text: { format: DRAFT_SCHEMA, verbosity: "low" }
  };

  if (visionResponseId) {
    requestParams.previous_response_id = visionResponseId;
  }

  logger.info("[LLM] Calling OpenAI API");
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
