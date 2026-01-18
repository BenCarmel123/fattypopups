import { upsertChefs } from '../../entities/chef/operations.js';
import { upsertVenue } from '../../entities/venue/operations.js';
import { createEventEmbeddings } from '../../vector/orchestrator.js';
import { insertEvent } from '../../entities/event/operations.js';
import { linkChefsToEvent } from '../../entities/linking/operations.js';

// Orchestrates creating an event with all related entities (venue, chefs, embeddings)
export const orchestrateEventCreate = async (body, file) => {
  const {
    title,
    start_datetime,
    end_datetime,
    venue_name,
    venue_instagram,
    venue_address,
    chef_names,
    chef_instagrams,
    reservation_url,
    english_description,
    hebrew_description,
    is_draft
  } = body;

  const poster = file?.location || null;
  const isDraft = is_draft === true || is_draft === "true";

  console.log('[EVENT] Creating event - isDraft:', isDraft);

  // 1. Process venue and chefs only if data is provided (drafts may be incomplete)
  let venueId = null;
  let chefIds = [];

  if (venue_name && venue_address && venue_instagram) {
    venueId = await upsertVenue(venue_name, venue_address, venue_instagram);
  }

  if (chef_names && chef_instagrams) {
    chefIds = await upsertChefs(chef_names, chef_instagrams);
  }

  // 2. Insert event into events_new
  const newEvent = await insertEvent({
    title,
    start_datetime,
    end_datetime,
    venue_id: venueId,
    poster,
    reservation_url,
    english_description,
    hebrew_description,
    is_draft
  });

  // 3. Link chefs to event if any were created
  if (chefIds.length > 0) {
    await linkChefsToEvent(newEvent.id, chefIds);
  }

  // 4. Generate embeddings ONLY for published events (drafts don't need RAG)
  if (!isDraft) {
    console.log('[EVENT] Generating embeddings for published event');
    await createEventEmbeddings(
      newEvent.id,
      english_description,
      hebrew_description
    );
  }

  return newEvent;
};
