import dotenvFlow from 'dotenv-flow';
import { OpenAI } from 'openai';

dotenvFlow.config();

// Initialize OpenAI entity
const apiKey = process.env.OPENAI_PROD_KEY;

if (!apiKey) {
  console.warn('[OPENAI] WARNING: OPENAI_PROD_KEY not found in environment variables!');
  console.warn('[OPENAI] Embeddings will not be generated.');
} else {
  console.log('[OPENAI] OpenAI client initialized successfully');
}

export const openai = apiKey
  ? new OpenAI({ apiKey })
  : null;
