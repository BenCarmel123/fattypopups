import { supabase } from '../../../config/supabaseClient.js';
import { fetchInstagram } from '../../agent/utils/fetchers.js';
import { extractInstagramHandle } from '../../agent/utils/parsers.js';
import 'dotenv/config';

export async function getOrCreateInstagram(name, entity = "chef") {
  const tag = entity === "chef" ? "c" : "v";

  // DB lookup
  const { data: existing, error: selectErr } = await supabase
    .from("instagrams")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (selectErr) throw selectErr;
  if (existing) return existing;

  // External fetch
  const searchResult = await fetchInstagram(
    `"${name}" site:instagram.com`
  );
  const handle = extractInstagramHandle(searchResult);
  if (!handle) return null;

  // Attempt insert
  const { data, error: insertErr } = await supabase
    .from("instagrams")
    .insert({ name, handle, tag })
    .select()
    .single();

  // Handle race condition
  if (insertErr) {
    if (insertErr.code === process.env.POSTGRES_UNIQUE_CONSTRAINT_CODE) {
      // unique violation 
      const { data } = await supabase
        .from("instagrams")
        .select("*")
        .eq("name", name)
        .single();
      return data;
    }
    throw insertErr;
  }

  return data;
}
