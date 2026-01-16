import { supabase } from "../../../config/instances.js";
import { generateEmbedding } from "../embeddings/api.js";
import { handleEventImageUpload } from "../../../s3/upload.js";
import { getEventById, updateEventById } from "./crud.js";

// UPDATE event (PUT) with image overwrite + embedding update
export const updateEvent = async (id, body, file) => {
  console.log("[REQUEST] Received PUT /api/events/:id");
  console.log("[REQUEST] Request body:", body);

  // 1. IMAGE OVERWRITE 
  await handleEventImageUpload(id, body, file);

  // 2. FETCH CURRENT EVENT (needed for description + embedding IDs)
  const currentEvent = await getEventById(id, 'english_description, hebrew_description, embedding_id_en, embedding_id_he, is_draft');

  if (!currentEvent) {
    throw new Error(`Event with id ${id} not found`);
  }

  // TODO: Update chef relationships in event_chefs junction table
  // Currently chef names are only parsed for embedding generation, not stored in event table
  // Need to:
  // 1. processChefs(chef_names, chef_instagrams) → get/create chef IDs
  // 2. Delete old event_chefs links for this event
  // 3. Insert new event_chefs links with new chef IDs
  // 4. Fetch chef names from event_chefs junction table (not from request body) for embeddings
  //    to keep chef-embedding-event relationships consistent
  
  // Parse chef names for embedding generation (temporary - see TODO above)
  const chefNamesArray = body.chef_names
    ? body.chef_names.split(',').map(name => name.trim())
    : [];

  const chefInstagramsArray = body.chef_instagrams
    ? body.chef_instagrams.split(',').map(handle => handle.trim())
    : [];

  body.chef_names = chefNamesArray;
  body.chef_instagrams = chefInstagramsArray;

  // MINIMAL CHANGE: Draft / Publish flags
// Handle both string and boolean is_draft values
const isDraft = body.is_draft === "true" || body.is_draft === true; 
const wasDraft = currentEvent.is_draft === true || currentEvent.is_draft === "true"; 
const toPublish = wasDraft && !isDraft;
const stillDraft = wasDraft && isDraft;
const alreadyPublished = !wasDraft;

console.log("[DEBUG] is_draft values - body:", body.is_draft, "| current:", currentEvent.is_draft);
console.log("[DEBUG] Flags - isDraft:", isDraft, "| wasDraft:", wasDraft, "| toPublish:", toPublish);

// Compute embedding changes
const englishChanged = body.english_description !== currentEvent.english_description;
const hebrewChanged  = body.hebrew_description !== currentEvent.hebrew_description;

let newEnglishEmbedding = null;
let newHebrewEmbedding = null;
let en_id = null;
let he_id = null;

// 3. GENERATE NEW EMBEDDINGS (IF NEEDED)
if (toPublish || (alreadyPublished && (englishChanged || hebrewChanged))) {
  console.log("[EMBEDDING] Descriptions changed — generating new embeddings...");    
  try {
    if (toPublish || englishChanged) {
      newEnglishEmbedding = await generateEmbedding(body.english_description);
    }
    if (toPublish || hebrewChanged) {
      newHebrewEmbedding = await generateEmbedding(body.hebrew_description);
    }
  } catch (embeddingErr) {
    console.log("[ERROR] Error generating embeddings:", embeddingErr);
  }
}

// 4. UPDATE EMBEDDINGS TABLE
if (toPublish) { 
  try {
    const { data: enRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'en',
        description: body.english_description,
        embedding: newEnglishEmbedding,
      })
      .select()
      .single();

    const { data: heRow } = await supabase
      .from('embeddings')
      .insert({
        chef_names: chefNamesArray.join(", "),
        language: 'he',
        description: body.hebrew_description,
        embedding: newHebrewEmbedding,
      })
      .select()
      .single();

      en_id = enRow.id
      he_id = heRow.id

  } 
  catch (e) {
    console.log("[ERROR] Error inserting embeddings:", e);
  }
}

// Update embeddings for already published events if changed
if (alreadyPublished) {
  try {
    if (newEnglishEmbedding) {
      await supabase
        .from('embeddings')
        .update({
          description: body.english_description,
          embedding: newEnglishEmbedding
        })
        .eq('id', currentEvent.embedding_id_en);
    }
    if (newHebrewEmbedding) {
      await supabase
        .from('embeddings')
        .update({
          description: body.hebrew_description,
          embedding: newHebrewEmbedding
        })
        .eq('id', currentEvent.embedding_id_he);
    }
  } catch(e) {
    console.log("[ERROR] Error updating embeddings:", e);
  }
} 

// 5. UPDATE EVENT
if (toPublish) {
  body.embedding_id_en = en_id;
  body.embedding_id_he = he_id;
}

const updatedEvent = await updateEventById(id, body);
return updatedEvent;
};
