import { getAllEventsWithRelations } from '../../entities/event/operations.js';
import { logger } from "../../../utils/logger.js";
import { redis } from "../../../config/index.js";
const REDIS_TTL = process.env.REDIS_TTL || 1800; 

// Get normalized events with all relations
export async function getEventsWithDetails(isAdmin = false) {
  const key = `events:${isAdmin ? 'admin' : 'public'}`;
  const cached = await redis.get(key);
  if (cached) {
    logger.info(`[Cache] HIT with key - ${key}`);
    return JSON.parse(cached);
  }
  logger.info(`[Cache] MISS with key - ${key}`);
  try {
    const data = await getAllEventsWithRelations(isAdmin);
    // Normalize the structure for client
    const normalizedData = data.map(event => ({
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
    await redis.set(key, JSON.stringify(normalizedData), 'EX', REDIS_TTL);
    return normalizedData;
  } catch (err) {
    logger.error("Unexpected error fetching events:", err);
    throw err;
  }
}
