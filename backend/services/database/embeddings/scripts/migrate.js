// migrate_embeddings.js
import { supabase } from '../../../../config/instances.js';
import { generateEmbedding } from "../api.js";

async function migrateEmbeddings() {
  console.log("[DEBUG] Fetching all events...");

  const { data: events, error } = await supabase
    .from('events')
    .select('id, chef_names, english_description, hebrew_description');

  if (error) {
    console.log("[ERROR] Error fetching events:", error);
    return;
  }

  console.log(`[DEBUG] Found ${events.length} events`);

  for (const event of events) {
    const { id, chef_names, english_description, hebrew_description } = event;

  console.log(`[DEBUG] Processing event ID ${id}`);

    try {
      // Generate embeddings
      const enEmbedding = await generateEmbedding(english_description);
      const heEmbedding = await generateEmbedding(hebrew_description);

      // Insert both rows
      const { error: insertError } = await supabase
        .from('embeddings')
        .insert([
          {
            chef_names: Array.isArray(chef_names)
              ? chef_names.join(", ")
              : chef_names,
            language: 'en',
            description: english_description,
            embedding: enEmbedding
          },
          {
            chef_names: Array.isArray(chef_names)
              ? chef_names.join(", ")
              : chef_names,
            language: 'he',
            description: hebrew_description,
            embedding: heEmbedding
          }
        ]);

      if (insertError) {
        console.log(`[ERROR] Error inserting embedding for event ID ${id}:`, insertError);
      } else {
        console.log(`[DEBUG] Embeddings stored for event ID ${id}`);
      }
    } catch (err) {
      console.log(`[ERROR] Error generating embedding for event ID ${id}:`, err);
    }
  }

  console.log("[DEBUG] Migration complete!");
}

// Run script
migrateEmbeddings();
