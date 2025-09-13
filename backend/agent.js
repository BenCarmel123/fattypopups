const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.KEY_2,
});

async function exampleUsage() {
  const response = await openai.responses.create({
    model:"gpt-3.5-turbo", input: "top 3 taverns in athens please!"
  })
  console.log(response);
}

exampleUsage().then(() => {
  console.log("Example usage completed.");
}).catch((err) => {
  console.error("Error in example usage:", err);  
});


