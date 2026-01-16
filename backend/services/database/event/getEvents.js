import { supabase } from "../../../config/supabase.js";

export async function getNormalizedEvents(isAdmin) {
  try {
    let query = supabase
      .from("events_new")
      .select(`
        *,
        venue:venues(id, name, address, instagram_handle),
        event_chefs(
          chef:chefs(id, name, instagram_handle)
        )
      `)
      .order("is_draft", { ascending: true })        
      .order("start_datetime", { ascending: true });  

    if (!isAdmin) {
      query = query.eq("is_draft", false);
    }

    const { data, error } = await query;

    if (error) {
      console.log("[ERROR] Error fetching events:", error);
      throw new Error(error.message);
    }

    // Normalize the structure
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