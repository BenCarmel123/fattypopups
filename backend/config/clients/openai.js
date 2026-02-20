import dotenvFlow from 'dotenv-flow';
import { OpenAI } from 'openai';
import { logger } from "../../utils/logger.js";

dotenvFlow.config();

// Initialize OpenAI entity
const apiKey = process.env.OPENAI_PROD_KEY;

if (!apiKey) {
  logger.warn('[OPENAI] WARNING: OPENAI_PROD_KEY not found in environment variables!');
  logger.warn('[OPENAI] Embeddings will not be generated.');
} else {
  logger.info('[OPENAI] OpenAI client initialized successfully');
}

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;
