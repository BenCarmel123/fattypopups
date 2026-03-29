import { openai } from '../../../../config/index.js';
import { logger } from '../../../../utils/logger.js';
import { buildVisionInstructions } from './buildVisionInstructions.js';

const VISION_SCHEMA = {
  type: "json_schema",
  name: "vision_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      extractedText: { type: "string" },
      cropCoordinates: {
        type: "object",
        properties: {
          top: { type: "number" },
          left: { type: "number" },
          bottom: { type: "number" },
          right: { type: "number" }
        },
        required: ["top", "left", "bottom", "right"],
        additionalProperties: false
      }
    },
    required: ["extractedText", "cropCoordinates"],
    additionalProperties: false
  }
};

export async function analyzeImage(posterUrl = null, contextUrl = null) {
  if (!posterUrl && !contextUrl) {
    return { extractedText: "", cropCoordinates: null };
  }

  const content = [];

  if (posterUrl) {
    content.push({ type: "input_image", image_url: posterUrl });
  }
  if (contextUrl) {
    content.push({ type: "input_image", image_url: contextUrl });
  }

  const instructions = buildVisionInstructions();
  content.push({ type: "input_text", text: "Analyze these images." });

  logger.info("[VISION] Calling OpenAI API with Image");
  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: [{ role: "user", content }],
    instructions,
    reasoning: { effort: "low" },
    text: { format: VISION_SCHEMA, verbosity: "low" }
  });

  logger.info("[VISION] " + response.output_text);
  if (!response.output_text) throw new Error("Vision API returned empty output");

  try {
    return JSON.parse(response.output_text);
  } catch (parseError) {
    logger.error("[VISION] Failed to parse output as JSON:", response.output_text);
    throw new Error("Vision API returned invalid JSON");
  }
}
