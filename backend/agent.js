// Require necessary modules and configure OpenAI client
require('dotenv').config();
const { OpenAI } = require('openai');
const openai = process.env.OPENAI_PROD_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_PROD_KEY })
  : null;
const { writeFile } = require('fs').promises;

// Function to generate event descriptions
async function generateEventDescriptions(chef_names, venue_address) {
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
    return response;
  }

// Function to generate event poster (stub for now)
async function generateEventPoster(chef_names, venue_address, event_description) {
  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: "A vibrant and enticing food event poster featuring top chefs, gourmet dishes, and a stylish venue backdrop. Include text: 'Exclusive Culinary Experience' and 'Book Now!'. Use warm colors and modern design elements.",
    size: "1024x1024",
    quality: "standard",
    n: 1,
}
  );
  const arrayBuffer = await response.arrayBuffer();
  await writeFile('event_poster.png', Buffer.from(arrayBuffer));
  console.log("Poster image saved as event_poster.png");
}

// Main function to generate event description and optionally poster (stub for now)
async function generateEvent(chef_names, venue_address, isPoster) {
  event_description = await generateEventDescriptions(chef_names, venue_address);
  if (isPoster) {
    event_poster = await generateEventPoster(chef_names, venue_address, event_description);
    return { event_description, event_poster };
  }
  return { event_description }; 
}


// Function to embed and store
async function generateEmbedding(description) {
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

module.exports = {
  generateEmbedding
};

