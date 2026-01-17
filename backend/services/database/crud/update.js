import { handleEventEmbeddingsUpdate } from "../embeddings/updateEmbeddings.js";
import { handleEventImageUpload } from "../../s3/upload.js";
import { getEventById, updateEventById } from "../event/operations.js";
import { computeUpdateState } from "../event/helpers.js";
import { getChefsForEvent } from "../chef/operations.js";
import { getVenueById } from "../venue/operations.js";
import { handleEventVenueUpdate } from "../event/operations.js";
import { handleEventChefsUpdate } from "../chef/operations.js";

// Orchestrates updating an event with all related operations (S3, embeddings, event data)
export const orchestrateEventUpdate = async (id, body, file) => {
  console.log("[UPDATE] Starting update for event ID:", id, "| File attached:", !!file);

  // 1. Fetch current event data
  const currentEvent = await getEventById(id, 'english_description, hebrew_description, embedding_id_en, embedding_id_he, is_draft, poster, venue_id');

  if (!currentEvent) {
    throw new Error(`Event with id ${id} not found`);
  }

  // 2. Handle image upload to S3
  console.log("[UPDATE] Handling image upload for event ID:", id);
  await handleEventImageUpload(id, body, file, currentEvent);
  console.log("[UPDATE] Image upload completed");

  // 3. Fetch current venue and chefs for change detection
  const [currentVenue, currentChefs] = await Promise.all([
    currentEvent.venue_id ? getVenueById(currentEvent.venue_id) : null,
    getChefsForEvent(id)
  ]);
  
  const currentChefNames = currentChefs.map(c => c.name).join(", ");
  
  console.log("[UPDATE] Venue:", currentVenue?.name || 'none', "| Chefs:", currentChefNames || 'none');

  // Save venue and chef data before deleting from body
  const venueName = body.venue_name;
  const venueAddress = body.venue_address;
  const venueInstagram = body.venue_instagram;
  const chefNames = body.chef_names;
  const chefInstagrams = body.chef_instagrams;

  // Remove chef and venue fields from body - these don't exist in events_new table
  delete body.chef_names;
  delete body.chef_instagrams;
  delete body.venue_name;
  delete body.venue_address;
  delete body.venue_instagram;

  // 4. Compute draft/publish state and what changed
  const {
    toPublish,
    alreadyPublished,
    englishChanged,
    hebrewChanged,
    venueChanged,
    chefsChanged
  } = computeUpdateState(body, currentEvent, currentVenue, currentChefs);

  // 5. Update embeddings
  const { en_id, he_id } = await handleEventEmbeddingsUpdate({
    toPublish,
    alreadyPublished,
    englishChanged,
    hebrewChanged,
    englishDescription: body.english_description,
    hebrewDescription: body.hebrew_description,
    chefNames: currentChefNames,
    currentEnglishId: currentEvent.embedding_id_en,
    currentHebrewId: currentEvent.embedding_id_he
  });

  // 6. Update venue relationship (if venue changed or publishing draft)
  const venueId = await handleEventVenueUpdate({
    eventId: id,
    venueName,
    venueAddress,
    venueInstagram,
    toPublish,
    venueChanged
  });

  // 7. Update chef relationships (if chefs changed or publishing draft)
  await handleEventChefsUpdate({
    chefNames,
    chefInstagrams,
    toPublish,
    chefsChanged
  });

  // 8. Update event record in database
  if (toPublish) {
    body.embedding_id_en = en_id;
    body.embedding_id_he = he_id;
  }

  if (venueId) {
    body.venue_id = venueId;
  }

  const updatedEvent = await updateEventById(id, body);

  // 9. Return updated event
  console.log("[UPDATE] Event update completed for ID:", id);
  return updatedEvent;
};
