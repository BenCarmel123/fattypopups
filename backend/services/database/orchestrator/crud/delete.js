import { getEventsByTitles, deleteEventsByTitles } from '../../entities/event/operations.js';
import { unlinkChefsFromEvent } from '../../entities/linking/operations.js';

// Orchestrates deleting events (removes junction links, keeps venue/chef/embedding entities)
export const deleteEvents = async (titles) => {
  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error('Titles must be a non-empty array');
  }

  // 1. Get event IDs for the titles
  const events = await getEventsByTitles(titles);
  
  if (!events || events.length === 0) {
    throw new Error('No events found with the provided titles');
  }

  // 2. Unlink all chefs from these events (cleanup junction table)
  await Promise.all(
    events.map(event => unlinkChefsFromEvent(event.id))
  );

  // 3. Delete events from events table
  // Keeps all other data (chefs, venues, embeddings) for historical/reuse purposes
  const result = await deleteEventsByTitles(titles);
  
  return result;
};
