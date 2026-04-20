import { supabase } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export async function insertLlmCallLog(entry) {
  const { error } = await supabase.from('llm_calls').insert(entry);
  if (error) logger.error('[LLM LOG] Failed to insert llm_call row:', error.message);
}
