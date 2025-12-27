// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { OpenAI } from 'openai';

// Function to embed and store
export async function generateEmbedding(description) {
  if (!openai) {
    console.warn("OpenAI client is not initialized. Skipping embedding creation.");
    return null; // Return a fallback value or handle gracefully
  }
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: description,
  });
  const embedding = embeddingResponse.data[0].embedding;
  return embedding;
}

// Initialize OpenAI entity
const openai = process.env.OPENAI_PROD_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_PROD_KEY })
  : null;

// Function to generate event descriptions
export async function generateEventDescriptions(chef_names, venue_address) {
  const response = await openai.responses.create({
    model: "gpt-4o",
    input: "chef names: " + chef_names + ", venue address: " + venue_address,
    instructions: process.env.PROMPT_INSTRUCTIONS,
    tools: [{
        type: "web_search",
        user_location: {
            type: "approximate",
            country: "IL", 
            city: "Tel Aviv",
            region: "Tel Aviv District"
        }, 
        search_context_size: "medium",
    }],
  });
    return response.output_text;
  }

// Function to extract chef and venue names
export async function extractChefAndVenue(prompt) {
  const response = await openai.responses.create({
    model: "gpt-4o",
    input: `${prompt}`,
    instructions: `${process.env.CHEF_VENUE_INSTRUCTIONS}`,
  });
  return response.output_text;
}



