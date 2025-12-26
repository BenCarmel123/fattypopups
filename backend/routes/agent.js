// Require necessary modules and configure OpenAI client
import 'dotenv/config';
import { OpenAI } from 'openai';
import { generateDraft } from '../services/agent/draft.js';
import express from 'express';

const openai = process.env.OPENAI_PROD_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_PROD_KEY })
  : null;
const authRouter = express.Router();

authRouter.post("/draft", async (req, res) => {

  const prompt = req.body; 

  // Client Error
  if (typeof prompt !== "string" || !prompt.trim()) 
    return res.status(400).json({ error: "A non-empty prompt is required" });

  try {
    // Generate draft with agent 
    const draft = await generateDraft(prompt);

    // Success 
    return res.status(200).json({ draft });
  } catch (e) {

    // Server Error
    console.error("Draft generation failed:", e);
    return res.status(500).json({ error: "Draft generation failed" });
    
  }
});

export default authRouter;