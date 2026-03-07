import { upsertChefs } from '../../entities/chef/operations.js';
import { upsertVenue } from '../../entities/venue/operations.js';
import { createEventEmbeddings } from '../../embeddings/storage/orchestrator.js';
import { insertEvent } from '../../entities/event/operations.js';
import { linkChefsToEvent } from '../../entities/linking/operations.js';
import { handleEventImageUpload } from '#services/s3/upload.js';
import { isTrue } from '../../../utils/isTrue.js';
import { logger } from "../../../utils/logger.js";
import { invalidateEventsCache } from '../../cache/invalidation.js';

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

  body.poster = await handleEventImageUpload(id=null, body, file, currentEvent=null);
  const isDraft = isTrue(is_draft);
  const chefNamesArray = chef_names?.split(',').map(s => s.trim()) ?? [];

  logger.info('[EVENT] Creating event - isDraft:', isDraft);

  // Early return for drafts - minimal processing
  if (isDraft) {
    logger.info('[EVENT] Draft mode - skipping venue, chefs, and embeddings');
    const draftEvent = await insertEvent({
      title,
      start_datetime,
      end_datetime,
      venue_id: null,
      poster: body.poster,
      reservation_url,
      english_description,
      hebrew_description,
      is_draft
    });
    await invalidateEventsCache();
    return draftEvent;
  }

  // Published event - full processing
  logger.info('[EVENT] Published mode - processing all relations');

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
    poster: body.poster,
    reservation_url,
    english_description,
    hebrew_description,
    is_draft
  });

  // 3. Link chefs and process embeddings in parallel
  await Promise.all([
    linkChefsToEvent(newEvent.id, chefIds),
    createEventEmbeddings(
      newEvent.id,
      english_description,
      hebrew_description,
      chefNamesArray.join(", ")
    )
  ]);

  await invalidateEventsCache();
  return newEvent;
};
