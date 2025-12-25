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
  const { prompt } = req.body;
  const draft = await generateDraft(prompt);
  res.json(draft);
});

export default authRouter;