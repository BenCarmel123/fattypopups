import { processChefs } from '../chef/operations.js';
import { processVenue } from '../venue/operations.js';
import { processEventEmbeddings } from '../embeddings/createEmbeddings.js';
import { insertEvent } from './helpers.js';

export const createEvent = async (body, file) => {
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

  // 1. Handle venue 
  const venueId = await processVenue(venue_name, venue_address, venue_instagram);

  // 2. Handle chefs 
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

  // 4. Link chefs to event
 

  if (is_draft) {
    return newEvent;
  }

  // 5. Process embeddings (generate, store, and link to event)
  await processEventEmbeddings(
    newEvent.id,
    english_description,
    hebrew_description,
    chefNamesArray.join(", ")
  );

  return newEvent;
};