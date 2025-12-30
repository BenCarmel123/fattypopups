// Script to link existing embeddings to events based on matching criteria
import { createClient } from '@supabase/supabase-js';
require('dotenv').config();

const supabase = createClient(process.env.DATABASE_PROD_URL, process.env.SUPABASE_KEY);

async function linkEmbeddings() {
  console.log("[DEBUG] Linking embeddings to events...");

  // 1. Fetch all events
  const { data: events, error: eventErr } = await supabase
    .from('events')
    .select('*');

  if (eventErr) {
    console.log("[ERROR] Error fetching events:", eventErr);
    return;
  }

  for (const event of events) {
    const chefNames = event.chef_names.join(", ");

    // Find EN embedding
    const { data: enEmbed, error: enErr } = await supabase
      .from('embeddings')
      .select('id')
      .eq('chef_names', chefNames)
      .eq('language', 'en')
      .eq('description', event.english_description)
      .single();

    // Find HE embedding
    const { data: heEmbed, error: heErr } = await supabase
      .from('embeddings')
      .select('id')
      .eq('chef_names', chefNames)
      .eq('language', 'he')
      .eq('description', event.hebrew_description)
      .single();

    if (enErr || heErr) {
      console.log(`[DEBUG] Skipping event ${event.id} (no match found)`);
      continue;
    }

    // Update event row
    await supabase
      .from('events')
      .update({
        embedding_id_en: enEmbed.id,
        embedding_id_he: heEmbed.id
      })
      .eq('id', event.id);

    console.log(`[DEBUG] Linked event ${event.id} → EN:${enEmbed.id} HE:${heEmbed.id}`);
  }

  console.log("[DEBUG] Done linking embeddings.");
}

linkEmbeddings();
