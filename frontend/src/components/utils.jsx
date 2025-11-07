import validator from 'validator';
import { LONG, BLANK, NO_OPENER, ERR_TITLE_REQUIRED, ERR_START_REQUIRED, ERR_END_REQUIRED, ERR_START_BEFORE_END, ERR_VENUE_INSTAGRAM_REQUIRED, 
    ERR_VENUE_ADDRESS_REQUIRED, ERR_CHEF_NAMES_REQUIRED, ERR_CHEF_INSTAGRAMS_REQUIRED, ERR_RESERVATION_URL_REQUIRED, ERR_ENGLISH_DESC_REQUIRED, 
    ERR_HEBREW_DESC_REQUIRED, ERR_POSTER_REQUIRED, STRING, NUMERIC, MINIMAL_TRANSITION, MINIMAL_TRANSFORM } from './config/strings';
import { HOVER, WHITE, GRAY } from './config/colors.jsx';


// Helper to validate event data
export default function validateEvent(event) {
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

    if (!poster || !(poster instanceof File)) {
        return { valid: false, error: ERR_POSTER_REQUIRED };
    }

    return { valid: true };
}

// Helper to format date ranges from start and end dates of events
export function formatDateRange(start, end) {
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const sameDay = startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
        if (sameDay) {
            return startDate.toLocaleDateString(undefined, { month: LONG, day: NUMERIC });
        }
        const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
        if (sameMonth) {
            return `${startDate.toLocaleDateString(undefined, { month: LONG })} ${startDate.getDate()}-${endDate.getDate()}`;
        } else {
            return `${startDate.toLocaleDateString(undefined, { month: LONG })} ${startDate.getDate()} - ${endDate.toLocaleDateString(undefined, { month: LONG })} ${endDate.getDate()}`;
        }
    } else if (start) {
        return new Date(start).toLocaleDateString(undefined, { month: LONG, day: NUMERIC });
    } else {
        return '';
    }
}

// Helper to format event description with English and Hebrew parts
export function formatEventDescription(event) {
    return (
        <div> 
            <p>{event.english_description}</p>
            <br />
            <p style={{ direction: 'rtl', unicodeBidi: 'isolate' }}>{event.hebrew_description}</p>
        </div>
    )
}

export const defaultOnMouseEnter = (e) => {
    e.currentTarget.style.padding = '0.4rem 0.8rem';
    e.currentTarget.style.borderRadius = '1rem';
    e.currentTarget.style.backgroundColor = HOVER;
    e.currentTarget.style.color = WHITE;
    e.currentTarget.style.transform = MINIMAL_TRANSFORM;
    e.currentTarget.style.transition = MINIMAL_TRANSITION;
}

export const defaultOnMouseLeave = (e) => {
    e.currentTarget.style.padding = '';
    e.currentTarget.style.borderRadius = '';
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.color = GRAY;
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.transition = MINIMAL_TRANSITION;
}

// Function to open Google Maps with the given address
export function handleMaps(address) {
  const query = encodeURIComponent(address);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(url, BLANK, NO_OPENER);
}

// Function to open WhatsApp with pre-filled message
export function handleWhatsApp(description) {
        const desc = description || '';
        window.open(`https://wa.me/?text=${encodeURIComponent(`${window.location.href}\n\n${desc}`)}`, BLANK, NO_OPENER);
    }

export function handleInstagram(instagram) {
    let instagramHandle = instagram;
    if (typeof instagram === STRING && instagram.length > 0 && instagram[0] === '@') {
        instagramHandle = instagram.slice(1);
    }
    window.open(`https://www.instagram.com/${instagramHandle}`, BLANK, NO_OPENER);
}

export function handleCalendar(event) {
    const { title, start_datetime, end_datetime, venue_address, reservation_url } = event;
    const start = new Date(start_datetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const end = new Date(end_datetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const details = `For reservations, visit: ${reservation_url}`;
    const location = venue_address;
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(calendarUrl, BLANK, NO_OPENER);
}