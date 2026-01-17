import { deleteEventsByTitles } from '../event/operations.js';

// Orchestrates deleting events (only removes from events table, keeps all historical data)
export const deleteEvents = async (titles) => {
  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error('Titles must be a non-empty array');
  }

  // Delete events from events table only
  // All other data (chefs, venues, embeddings, event_chefs junction) remains for historical purposes
  const result = await deleteEventsByTitles(titles);
  
  return result;
};
