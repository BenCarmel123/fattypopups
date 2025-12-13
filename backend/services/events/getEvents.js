import { supabase } from "../../config/supabaseClient.js";

export async function getEvents(isAdmin) {
  try {
    let query = supabase
      .from("events")
      .select("*")
      .order("start_datetime", { ascending: true });

    if (!isAdmin) {
      query = query.eq("is_draft", false);
    }

    const { data, error } = await query;

    if (error) {
      console.log("[ERROR] - Error fetching events:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.log("[ERROR] - Unexpected error fetching events:", err);
    throw err;
  }
}
