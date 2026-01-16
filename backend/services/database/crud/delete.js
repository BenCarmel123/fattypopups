import { getEventsByTitles, deleteEventsByTitles } from '../event/operations.js';
import { supabase } from '../../../config/instances.js';

// Orchestrates deleting events with cleanup of related data
export const deleteEventsWithCleanup = async (titles) => {
  if (!Array.isArray(titles) || titles.length === 0) {
    throw new Error('Titles must be a non-empty array');
  }

  // 1. Get events with their embedding IDs
  const events = await getEventsByTitles(titles);
  
  if (events.length === 0) {
    return { message: 'No events found to delete', deleted: [] };
  }

  // 2. TODO: Delete event_chefs junction records
  // const eventIds = events.map(e => e.id);
  // await supabase
  //   .from('event_chefs')
  //   .delete()
  //   .in('event_id', eventIds);

  // 3. Delete embeddings (they're event-specific, not shared)
  const embeddingIds = events
    .flatMap(e => [e.embedding_id_en, e.embedding_id_he])
    .filter(Boolean); // Remove null/undefined values

  if (embeddingIds.length > 0) {
    const { error: embeddingError } = await supabase
      .from('embeddings')
      .delete()
      .in('id', embeddingIds);

    if (embeddingError) {
      console.log('[ERROR] Error deleting embeddings:', embeddingError);
      // Continue with event deletion even if embeddings fail
    }
  }

  // 4. Delete events (chefs and venues are kept - they're shared resources)
  const result = await deleteEventsByTitles(titles);
  
  return result;
};
