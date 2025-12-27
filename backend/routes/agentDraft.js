// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { generateDraft } from '../services/agent/createDraft.js';
import express from 'express';
import { createEvent } from '../services/events/createEvent.js';

const authRouter = express.Router();

authRouter.post("/draft", async (req, res) => {
  console.log("[DEBUG] Reached Endpoint")
  const prompt = req.body;

  // Client error
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty prompt is required" });
  }

  try {
    // Generate draft
    const draft = await generateDraft(prompt);
    console.log("[DEBUG] Draft Generated")

    // Create event from draft
    const newEvent = await createEvent(draft, null);
    console.log("[DEBUG] Event Created")

    // Success response
    return res.status(200).json({ event: newEvent });

  } catch (err) {
    console.error("[ERROR] Draft or event creation failed:", err);
    return res.status(500).json({ error: "Draft or event creation failed", draft: newEvent });
  }
});


export default authRouter;