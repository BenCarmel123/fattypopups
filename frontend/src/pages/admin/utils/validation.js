import validator from 'validator';
import * as Config from 'config/index.jsx';

// Helper to validate event data
export default function validateEvent(formData, _isEdit, isDraft = false) {
    const { title, start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, reservation_url, english_description, hebrew_description } = Object.fromEntries(formData.entries());

    // Title is always required, even for drafts
    if (!title?.trim()) return { valid: false, error: Config.ERR_TITLE_REQUIRED };

    // If it's a draft, only title is required
    if (isDraft) return { valid: true };

    // Validate date fields
    const dateFields = [ [start_datetime, Config.ERR_START_REQUIRED], [end_datetime, Config.ERR_END_REQUIRED] ];
    for (const [value, error] of dateFields) {
        if (!value || isNaN(Date.parse(value))) return { valid: false, error };
    }

    if (new Date(start_datetime) > new Date(end_datetime)) return { valid: false, error: Config.ERR_START_BEFORE_END };

    // Validate required text fields
    const requiredFields = [
        [venue_instagram, Config.ERR_VENUE_INSTAGRAM_REQUIRED],
        [venue_address, Config.ERR_VENUE_ADDRESS_REQUIRED],
        [chef_names, Config.ERR_CHEF_NAMES_REQUIRED],
        [chef_instagrams, Config.ERR_CHEF_INSTAGRAMS_REQUIRED],
        [english_description, Config.ERR_ENGLISH_DESC_REQUIRED],
        [hebrew_description, Config.ERR_HEBREW_DESC_REQUIRED],
    ];
    for (const [value, error] of requiredFields) {
        if (!value?.trim()) return { valid: false, error };
    }

    if (!reservation_url || !validator.isURL(reservation_url)) return { valid: false, error: Config.ERR_RESERVATION_URL_REQUIRED };


    return { valid: true };
}
