import validator from 'validator';
import { SHORT, SELF, NO_OPENER, ERR_TITLE_REQUIRED, ERR_START_REQUIRED, ERR_END_REQUIRED, ERR_START_BEFORE_END, ERR_VENUE_INSTAGRAM_REQUIRED, 
    ERR_VENUE_ADDRESS_REQUIRED, ERR_CHEF_NAMES_REQUIRED, ERR_CHEF_INSTAGRAMS_REQUIRED, ERR_RESERVATION_URL_REQUIRED, ERR_ENGLISH_DESC_REQUIRED, 
    ERR_HEBREW_DESC_REQUIRED, ERR_POSTER_REQUIRED, STRING, NUMERIC, MINIMAL_TRANSITION, MINIMAL_TRANSFORM } from '../../../config/strings';
import { HOVER, GRAY } from '../../../config/colors.jsx';


// Helper to validate event data
export default function validateEvent(event, isEdit) {
    const { title, start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, reservation_url, english_description, hebrew_description, poster } = event;

    if (!title || typeof title !== STRING || !validator.isLength(title.trim(), { min: 1 })) {
        return { valid: false, error: ERR_TITLE_REQUIRED };
    }

    if (!start_datetime || isNaN(Date.parse(start_datetime))) {
        return { valid: false, error: ERR_START_REQUIRED };
    }
    if (!end_datetime || isNaN(Date.parse(end_datetime))) {
        return { valid: false, error: ERR_END_REQUIRED };
    }
    if (new Date(start_datetime) > new Date(end_datetime)) {
        return { valid: false, error: ERR_START_BEFORE_END };
    }

    if (!venue_instagram || typeof venue_instagram !== STRING || !validator.isLength(venue_instagram.trim(), { min: 1 })) {
        return { valid: false, error: ERR_VENUE_INSTAGRAM_REQUIRED };
    }

    if (!venue_address || typeof venue_address !== STRING || !validator.isLength(venue_address.trim(), { min: 1 })) {
        return { valid: false, error: ERR_VENUE_ADDRESS_REQUIRED };
    }

    if (!chef_names || typeof chef_names !== STRING || !validator.isLength(chef_names.trim(), { min: 1 })) {
        return { valid: false, error: ERR_CHEF_NAMES_REQUIRED };
    }

    if (!chef_instagrams || typeof chef_instagrams !== STRING || !validator.isLength(chef_instagrams.trim(), { min: 1 })) {
        return { valid: false, error: ERR_CHEF_INSTAGRAMS_REQUIRED };
    }

    if (!reservation_url || typeof reservation_url !== STRING || !validator.isURL(reservation_url)) {
        return { valid: false, error: ERR_RESERVATION_URL_REQUIRED };
    }

    if (!english_description || typeof english_description !== STRING || !validator.isLength(english_description.trim(), { min: 1 })) {
        return { valid: false, error: ERR_ENGLISH_DESC_REQUIRED };
    }

    if (!hebrew_description || typeof hebrew_description !== STRING || !validator.isLength(hebrew_description.trim(), { min: 1 })) {
        return { valid: false, error: ERR_HEBREW_DESC_REQUIRED };
    }
    
    if (!isEdit && (!poster || !(poster instanceof File))) {
        return { valid: false, error: ERR_POSTER_REQUIRED };
    }

    return { valid: true };
}
