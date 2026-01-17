import { upsertChefs } from '../../entities/chef/operations.js';
import { upsertVenue } from '../../entities/venue/operations.js';
import { processEventEmbeddings } from '../../vector/orchestrator.js';
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
  const chefNamesArray = chef_names?.split(',').map(s => s.trim()) ?? [];

  console.log('[EVENT] Creating event - isDraft:', isDraft);

  // Early return for drafts - minimal processing
  if (isDraft) {
    console.log('[EVENT] Draft mode - skipping venue, chefs, and embeddings');
    return await insertEvent({
      title,
      start_datetime,
      end_datetime,
      venue_id: null,
      poster,
      reservation_url,
      english_description,
      hebrew_description,
      is_draft
    });
  }

  // Published event - full processing
  console.log('[EVENT] Published mode - processing all relations');

  // 1. Process venue and chefs in parallel (independent operations)
  const [venueId, chefIds] = await Promise.all([
    upsertVenue(venue_name, venue_address, venue_instagram),
    upsertChefs(chef_names, chef_instagrams)
  ]);

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

  // 3. Link chefs and process embeddings in parallel (both use newEvent.id)
  await Promise.all([
    linkChefsToEvent(newEvent.id, chefIds),
    processEventEmbeddings(
      newEvent.id,
      english_description,
      hebrew_description,
      chefNamesArray.join(", ")
    )
  ]);

  return newEvent;
};
