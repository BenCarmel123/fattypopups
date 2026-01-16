import { handleEventEmbeddingsUpdate } from "../embeddings/updateEmbeddings.js";
import { handleEventImageUpload } from "../../../s3/upload.js";
import { getEventById, updateEventById } from "../event/operations.js";
import { computeUpdateState } from "../event/helpers.js";

// Orchestrates updating an event with all related operations (S3, embeddings, event data)
export const updateEventWithRelations = async (id, body, file) => {
  console.log("[UPDATE] Starting event update for ID:", id);
  console.log("[REQUEST] Request body:", body);
  console.log("[REQUEST] File attached:", !!file);

  // ============================================================================
  // IMAGE HANDLING (S3 Upload)
  // ============================================================================
  console.log("[IMAGE] Handling image upload for event ID:", id);
  await handleEventImageUpload(id, body, file);
  console.log("[IMAGE] Image upload completed");

  // ============================================================================
  // FETCH CURRENT EVENT DATA
  // ============================================================================
  const currentEvent = await getEventById(id, 'english_description, hebrew_description, embedding_id_en, embedding_id_he, is_draft');

  if (!currentEvent) {
    throw new Error(`Event with id ${id} not found`);
  }

  // ============================================================================
  // PARSE & VALIDATE INPUT
  // ============================================================================
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

  // Compute draft/publish state and what changed
  const {
    toPublish,
    alreadyPublished,
    englishChanged,
    hebrewChanged
  } = computeUpdateState(body, currentEvent);

  // ============================================================================
  // EMBEDDING UPDATES
  // ============================================================================
  const { en_id, he_id } = await handleEventEmbeddingsUpdate({
    toPublish,
    alreadyPublished,
    englishChanged,
    hebrewChanged,
    englishDescription: body.english_description,
    hebrewDescription: body.hebrew_description,
    chefNames: chefNamesArray.join(", "),
    currentEnglishId: currentEvent.embedding_id_en,
    currentHebrewId: currentEvent.embedding_id_he
  });

  // ============================================================================
  // UPDATE EVENT RECORD
  // ============================================================================
  if (toPublish) {
    body.embedding_id_en = en_id;
    body.embedding_id_he = he_id;
  }

  const updatedEvent = await updateEventById(id, body);

  // ============================================================================
  // RETURN RESULT
  // ============================================================================
  console.log("[UPDATE] Event update completed for ID:", id);
  return updatedEvent;
};
