import { supabase } from '../../../config/supabaseClient.js';

export const deleteEvent = async (titles) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .in('title', titles);

  if (error) throw error;

  return { message: 'Events deleted successfully', deleted: titles };
};
