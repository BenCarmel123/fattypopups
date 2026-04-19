import dotenvFlow from 'dotenv-flow';
import { OpenAI } from 'openai';
import { logger } from "../../utils/logger.js";

dotenvFlow.config();

const apiKey = process.env.OPENAI_PROD_KEY;

if (!apiKey) {
  logger.warn('[OPENAI] WARNING: OPENAI_PROD_KEY not found in environment variables!');
} else {
  logger.info('[OPENAI] OpenAI client initialized successfully');
}

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;
