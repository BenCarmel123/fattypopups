const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.KEY_2,
});

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
  console.log(response.output_text);
}

generateEventDescriptions("eyal shani", "santi").then(() => {
  console.log("Example usage completed.");
}).catch((err) => {
  console.error("Error in example usage:", err);  
});


