import dotenvFlow from 'dotenv-flow';
import { createClient } from '@supabase/supabase-js';
import { logger } from "../../utils/logger.js";

// Automatically loads .env.development or .env.production based on NODE_ENV
dotenvFlow.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Missing Supabase credentials in environment: ${process.env.NODE_ENV || 'development'}`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

logger.info(`[SUPABASE] Connected to Supabase (${process.env.NODE_ENV || 'development'} environment)`);
