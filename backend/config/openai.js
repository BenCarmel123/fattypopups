import 'dotenv/config';
import { OpenAI } from 'openai';

// Initialize OpenAI entity
export const openai = process.env.OPENAI_PROD_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_PROD_KEY })
  : null;
