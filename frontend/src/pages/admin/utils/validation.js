import validator from 'validator';
import * as Config from 'config/index.jsx';


// Helper to validate event data
export default function validateEvent(event, isEdit, isDraft = false) {
    const { title, start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, reservation_url, english_description, hebrew_description, poster } = event;

    // Title is always required, even for drafts
    if (!title || typeof title !== Config.STRING || !validator.isLength(title.trim(), { min: 1 })) {
        return { valid: false, error: Config.ERR_TITLE_REQUIRED };
    }

    // If it's a draft, only title is required
    if (isDraft) {
        return { valid: true };
    }

    if (!start_datetime || isNaN(Date.parse(start_datetime))) {
        return { valid: false, error: Config.ERR_START_REQUIRED };
    }
    if (!end_datetime || isNaN(Date.parse(end_datetime))) {
        return { valid: false, error: Config.ERR_END_REQUIRED };
    }
    if (new Date(start_datetime) > new Date(end_datetime)) {
        return { valid: false, error: Config.ERR_START_BEFORE_END };
    }

    if (!venue_instagram || typeof venue_instagram !== Config.STRING || !validator.isLength(venue_instagram.trim(), { min: 1 })) {
        return { valid: false, error: Config.ERR_VENUE_INSTAGRAM_REQUIRED };
    }

    if (!venue_address || typeof venue_address !== Config.STRING || !validator.isLength(venue_address.trim(), { min: 1 })) {
        return { valid: false, error: Config.ERR_VENUE_ADDRESS_REQUIRED };
    }

    if (!chef_names || typeof chef_names !== Config.STRING || !validator.isLength(chef_names.trim(), { min: 1 })) {
        return { valid: false, error: Config.ERR_CHEF_NAMES_REQUIRED };
    }

    if (!chef_instagrams || typeof chef_instagrams !== Config.STRING || !validator.isLength(chef_instagrams.trim(), { min: 1 })) {
        return { valid: false, error: Config.ERR_CHEF_INSTAGRAMS_REQUIRED };
    }

    if (!reservation_url || typeof reservation_url !== Config.STRING || !validator.isURL(reservation_url)) {
        return { valid: false, error: Config.ERR_RESERVATION_URL_REQUIRED };
    }

    if (!english_description || typeof english_description !== Config.STRING || !validator.isLength(english_description.trim(), { min: 1 })) {
        return { valid: false, error: Config.ERR_ENGLISH_DESC_REQUIRED };
    }

    if (!hebrew_description || typeof hebrew_description !== Config.STRING || !validator.isLength(hebrew_description.trim(), { min: 1 })) {
        return { valid: false, error: Config.ERR_HEBREW_DESC_REQUIRED };
    }
    
    if (!isEdit && (!poster || !(poster instanceof File))) {
        return { valid: false, error: Config.ERR_POSTER_REQUIRED };
    }

    return { valid: true };
}
