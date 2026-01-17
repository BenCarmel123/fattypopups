import { supabase } from '../../../../config/index.js';
import { fetchInstagram } from '../../../agent/utils/fetch.js';
import { extractInstagramHandle } from '../../../agent/utils/parse.js';
import 'dotenv/config';

/**
 * Just check if Instagram record exists in database - no creation
 * Returns existing record or null if not found
 */
export async function getInstagramIfExists(name, entity = "venue") {
  const { data: existing, error: selectErr } = await supabase
    .from("instagrams")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (selectErr) throw selectErr;
  
  if (existing) {
    console.log(`[INSTAGRAM] Found existing record for "${name}": ${existing.handle}`);
    return existing;
  } else {
    console.log(`[INSTAGRAM] No existing record found for "${name}"`);
    return null;
  }
}

export async function getOrCreateInstagram(name, entity = "chef") {
  // Map entity to database constraint values ("c" for chef, "v" for venue)
  const entityValue = entity.toLowerCase() === "venue" ? "v" : "c";
  
  // DB lookup
  const { data: existing, error: selectErr } = await supabase
    .from("instagrams")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (selectErr) throw selectErr;
  if (existing) {
    console.log(`[INSTAGRAM] Found existing record for "${name}": ${existing.handle}`);
    return existing;
  }

  // External fetch
  const searchResult = await fetchInstagram(
    `"${name}" site:instagram.com`
  );
  const handle = extractInstagramHandle(searchResult);
  if (!handle) {
    console.log(`[INSTAGRAM] No Instagram handle found for "${name}"`);
    return null;
  }

  // Attempt insert
  const { data, error: insertErr } = await supabase
    .from("instagrams")
    .insert({ name, handle, entity: entityValue })
    .select()
    .single();

  // Handle race condition
  if (insertErr) {
    if (insertErr.code === process.env.POSTGRES_UNIQUE_CONSTRAINT_CODE) {
      // unique violation 
      console.log(`[INSTAGRAM] Race condition detected for "${name}" - fetching existing record`);
      const { data } = await supabase
        .from("instagrams")
        .select("*")
        .eq("name", name)
        .single();
      return data;
    }
    throw insertErr;
  }

  console.log(`[INSTAGRAM] Created new record for "${name}": ${handle}`);
  return data;
}
