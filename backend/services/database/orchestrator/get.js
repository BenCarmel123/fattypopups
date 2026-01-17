import { getAllEventsWithRelations } from '../event/operations.js';

// Get normalized events with all relations for API response
export async function getEventsWithDetails(isAdmin = false) {
  try {
    const data = await getAllEventsWithRelations(isAdmin);

    // Normalize the structure for frontend
    return data.map(event => ({
      id: event.id,
      title: event.title,
      startDatetime: event.start_datetime,
      endDatetime: event.end_datetime,
      poster: event.poster,
      reservationUrl: event.reservation_url,
      englishDescription: event.english_description,
      hebrewDescription: event.hebrew_description,
      isDraft: event.is_draft,
      createdAt: event.created_at,
      embeddingIdEn: event.embedding_id_en,
      embeddingIdHe: event.embedding_id_he,
      venue: event.venue,
      chefs: event.event_chefs.map(ec => ec.chef)
    }));
  } catch (err) {
    console.log("[ERROR] Unexpected error fetching events:", err);
    throw err;
  }
}
