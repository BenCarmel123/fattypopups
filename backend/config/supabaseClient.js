import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(process.env.DATABASE_PROD_URL, process.env.SUPABASE_KEY);
