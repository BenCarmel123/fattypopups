// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { openai } from '../../config/index.js';

// Function to generate draft details
export async function GenerateDraftDetails(prompt, imageUrl = null) {
  console.log("[AGENT] Prompt: " + prompt);

  const content = [
    { type: "input_text", text: prompt }
  ];

  if (imageUrl) {
    content.push({
      type: "input_image",
      image_url: imageUrl
    });
  }

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: content,
    instructions: `${process.env.DRAFT_INSTRUCTIONS}`,
  });

  console.log("[AGENT] " + response.output_text);
  if (!response.output_text) throw new Error("LLM returned empty output");
  return response.output_text;
}
