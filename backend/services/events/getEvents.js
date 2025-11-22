import { supabase } from "../../config/supabaseClient.js";

export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_datetime", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    throw new Error(error.message);
  }
  return data;
}