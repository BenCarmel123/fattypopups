import { supabase } from '../../backend/config/clients/supabase.js'

export const deletePastEvents = async () => {
    try {
        const oldest_allowed_date = new Date();
        oldest_allowed_date.setDate(oldest_allowed_date.getDate() - 14);
        const { data, error } = await supabase
            .from('events_new')
                .delete()
                .lt('end_datetime', oldest_allowed_date.toISOString())
                .select('*');
        if (error) {
            console.log("[ERROR] Error deleting past events:", error);
            return;
        }
        console.log(`[EVENT] Deleted ${data?.length ?? 0} past events.`);
    }
    catch (error) {
        console.log("[ERROR] Unexpected error deleting past events:", error);
    }
}

export const handler = async () => {
    await deletePastEvents();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Past events deleted successfully.' }),
    };
};