// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { openai } from '../../config/instances.js';

// Function to generate draft details
export async function GenerateDraftDetails(prompt) {
  console.log("[AGENT] Prompt: " + prompt)
   const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: `${prompt}`,
    instructions: `${process.env.DRAFT_INSTRUCTIONS}`,
  });
  console.log("[AGENT] " + response.output_text)
  if (!response.output_text) throw new Error("LLM returned empty output");
  return response.output_text;
}
