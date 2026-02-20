import { getAllEventsWithRelations } from '../../entities/event/operations.js';
import { logger } from "../../../../utils/logger.js";

// Get normalized events with all relations for API response
export async function getEventsWithDetails(isAdmin = false) {
  try {
    const data = await getAllEventsWithRelations(isAdmin);

    // Normalize the structure for client
    return data.map(event => ({
      id: event.id,
      title: event.title,
      start_datetime: event.start_datetime,
      end_datetime: event.end_datetime,
      poster: event.poster,
      reservation_url: event.reservation_url,
      english_description: event.english_description,
      hebrew_description: event.hebrew_description,
      is_draft: event.is_draft,
      created_at: event.created_at,
      embedding_id_en: event.embedding_id_en,
      embedding_id_he: event.embedding_id_he,
      venue: {
        name: event.venue?.name || '',
        address: event.venue?.address || '',
        instagram_handle: event.venue?.instagram_handle || ''
      },
      chefs: event.event_chefs.map(ec => ({
        name: ec.chef?.name || '',
        instagram_handle: ec.chef?.instagram_handle || ''
      })).filter(chef => chef.name)
    }));
  } catch (err) {
    logger.error("Unexpected error fetching events:", err);
    throw err;
  }
}
