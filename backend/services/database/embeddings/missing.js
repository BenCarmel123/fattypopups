// migrate_missing_embeddings.js
import { supabase } from '../../../config/instances.js';
import { generateEmbedding } from "./api.js";

async function migrateMissingEmbeddings() {
  console.log("[DEBUG] Fetching all events...");

  // Get all events and their embedding IDs
  const { data: events, error } = await supabase
    .from('events')
    .select('id, chef_names, english_description, hebrew_description, embedding_id_en, embedding_id_he');

  if (error) {
    console.log("[ERROR] Error fetching events:", error);
    return;
  }

  console.log(`[DEBUG] Found ${events.length} events`);

  for (const event of events) {
    const { id, chef_names, english_description, hebrew_description, embedding_id_en, embedding_id_he } = event;

    // Only process events missing embeddings
    if (!embedding_id_en || !embedding_id_he) {
      console.log(`[DEBUG] Processing event ID ${id} (missing embeddings)`);

      try {
        let enEmbedding = null, heEmbedding = null, enRow = null, heRow = null;

        if (!embedding_id_en && english_description) {
          enEmbedding = await generateEmbedding(english_description);
          const { data, error } = await supabase
            .from('embeddings')
            .insert({
              chef_names: Array.isArray(chef_names) ? chef_names.join(", ") : chef_names,
              language: 'en',
              description: english_description,
              embedding: enEmbedding
            })
            .select()
            .single();
          if (error) {
            console.log(`[ERROR] Error inserting EN embedding for event ID ${id}:`, error);
          } else {
            enRow = data;
            // Update event with new embedding ID
            await supabase
              .from('events')
              .update({ embedding_id_en: enRow.id })
              .eq('id', id);
            console.log(`[DEBUG] EN embedding stored for event ID ${id}`);
          }
        }

        if (!embedding_id_he && hebrew_description) {
          heEmbedding = await generateEmbedding(hebrew_description);
          const { data, error } = await supabase
            .from('embeddings')
            .insert({
              chef_names: Array.isArray(chef_names) ? chef_names.join(", ") : chef_names,
              language: 'he',
              description: hebrew_description,
              embedding: heEmbedding
            })
            .select()
            .single();
          if (error) {
            console.log(`[ERROR] Error inserting HE embedding for event ID ${id}:`, error);
          } else {
            heRow = data;
            // Update event with new embedding ID
            await supabase
              .from('events')
              .update({ embedding_id_he: heRow.id })
              .eq('id', id);
            console.log(`[DEBUG] HE embedding stored for event ID ${id}`);
          }
        }
      } catch (err) {
        console.log(`[ERROR] Error generating embedding for event ID ${id}:`, err);
      }
    }
  }

  console.log("[DEBUG] Migration of missing embeddings complete!");
}

// Run script
migrateMissingEmbeddings();