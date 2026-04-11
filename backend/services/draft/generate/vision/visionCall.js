import { openai } from '../../../../config/index.js';
import { logger } from '../../../../utils/logger.js';
import { buildVisionInstructions } from './buildVisionInstructions.js';
import { VISION_SCHEMA } from '../../../../schemas/openai.schema.js';

export async function analyzeImage(posterUrl = null, contextUrl = null, toCrop) {
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

  const instructions = buildVisionInstructions(toCrop);
  content.push({ type: "input_text", text: "Analyze these images." });

  logger.info("[VISION] Calling OpenAI API with Image");
  const response = await openai.responses.create({
    model: "gpt-5.4",
    input: [{ role: "user", content }],
    instructions,
    reasoning: { effort: "high" },
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
