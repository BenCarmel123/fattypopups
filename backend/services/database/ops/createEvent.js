import { processChefs } from '../chef/helpers.js';
import { processVenue } from '../venue/helpers.js';
import { processEventEmbeddings } from '../embeddings/process.js';
import { insertEvent, linkChefsToEvent } from '../event/crud.js';

// Orchestrates creating an event with all related entities (venue, chefs, embeddings)
export const createEventWithRelations = async (body, file) => {
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

  // 1. Process venue (get existing or create new)
  const venueId = await processVenue(venue_name, venue_address, venue_instagram);

  // 2. Process chefs (get existing or create new)
  const chefIds = await processChefs(chef_names, chef_instagrams);
  const chefNamesArray = chef_names?.split(',').map(s => s.trim()) ?? [];

  // 3. Insert event into events_new
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

  // 4. Link chefs to event in junction table
  await linkChefsToEvent(newEvent.id, chefIds);

  // 5. Process embeddings only if not a draft
  // Handle both string and boolean is_draft values
  const isDraft = is_draft === true || is_draft === "true";
  console.log('[EVENT] is_draft value:', is_draft, 'Type:', typeof is_draft, 'Parsed as draft:', isDraft);
  
  if (!isDraft) {
    console.log('[EVENT] Processing embeddings...');
    await processEventEmbeddings(
      newEvent.id,
      english_description,
      hebrew_description,
      chefNamesArray.join(", ")
    );
  } else {
    console.log('[EVENT] Skipping embeddings - event is a draft');
  }

  return newEvent;
};
