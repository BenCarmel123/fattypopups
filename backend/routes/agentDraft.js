// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { generateDraft } from '../services/agent/draft.js';
import express from 'express';
import { createEvent } from '../services/database/event/createEvent.js'; 

const agentRouter = express.Router();

agentRouter.post("/draft", async (req, res) => {
  console.log("[REQUEST] Reached Endpoint\n")
  const prompt = req.body;

  // Client error
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty prompt is required" });
  }

  try {
    // Generate draft
    const draft = await generateDraft(prompt);
    console.log("[EVENT] Draft Generated\n")

    // Create event from draft
    const newEvent = await createEvent(draft, null);
    console.log("[EVENT] Event Created\n")

    // Success response
    return res.status(200).json({ event: newEvent });

  } catch (err) {
    console.error("[ERROR] Draft or event creation failed:", err, "\n");
    return res.status(500).json({ error: "Draft or event creation failed" });
  }
});


export default agentRouter;