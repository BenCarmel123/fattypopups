// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { generateDraft } from '../services/agent/draft.js';
import express from 'express';
import { orchestrateEventCreate } from '../services/database/orchestrator/index.js'; 
import { logger } from "../utils/logger.js";

const agentRouter = express.Router();

agentRouter.post("/draft", async (req, res) => {
  logger.info("[REQUEST] Reached /draft endpoint\n");
  const prompt = req.body;

  // Client error
  if (typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "A non-empty prompt is required" });
  }

  try {
    // Generate draft
    const draft = await generateDraft(prompt);
    logger.info("[EVENT] Draft generated and event created\n");

    // Create event from draft
    const newEvent = await orchestrateEventCreate(draft, null);

    // Success response
    return res.status(200).json({ event: newEvent });

  } catch (err) {
    logger.error("[ERROR] Draft or event creation failed:", err, "\n");
    return res.status(500).json({ error: "Draft or event creation failed" });
  }
});


export default agentRouter;