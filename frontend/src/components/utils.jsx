import validator from 'validator';
import { SHORT, SELF, NO_OPENER, ERR_TITLE_REQUIRED, ERR_START_REQUIRED, ERR_END_REQUIRED, ERR_START_BEFORE_END, ERR_VENUE_INSTAGRAM_REQUIRED, 
    ERR_VENUE_ADDRESS_REQUIRED, ERR_CHEF_NAMES_REQUIRED, ERR_CHEF_INSTAGRAMS_REQUIRED, ERR_RESERVATION_URL_REQUIRED, ERR_ENGLISH_DESC_REQUIRED, 
    ERR_HEBREW_DESC_REQUIRED, ERR_POSTER_REQUIRED, STRING, NUMERIC, MINIMAL_TRANSITION, MINIMAL_TRANSFORM } from '../config/strings';
import { HOVER, GRAY } from '../config/colors.jsx';


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

// Helper to format date ranges from start and end dates of events
export function formatDateRange(start, end) {
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const sameDay = startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
        if (sameDay) {
            return startDate.toLocaleDateString(undefined, { month: SHORT, day: NUMERIC });
        }
        const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
        if (sameMonth) {
            return `${startDate.toLocaleDateString(undefined, { month: SHORT })} ${startDate.getDate()}-${endDate.getDate()}`;
        } else {
            return `${startDate.toLocaleDateString(undefined, { month: SHORT })} ${startDate.getDate()} -${endDate.toLocaleDateString(undefined, { month: SHORT })} ${endDate.getDate()}`;
        }
    } else if (start) {
        return new Date(start).toLocaleDateString(undefined, { month: SHORT, day: NUMERIC });
    } else {
        return '';
    }
}

// Helper to format event description with English and Hebrew parts
export function formatEventDescription(event) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'left', letterSpacing: '1.2px' }}>{event.englishDescription}</p>
      <div
        style={{
          width: '50%',
          height: '2px',
          backgroundColor: '#d3d3d3',
          margin: '1.2rem auto',
          borderRadius: '2px',
        }}
      ></div>
      <p style={{ direction: 'rtl', unicodeBidi: 'isolate', textAlign: 'right', letterSpacing: '1.2px' }}>
        {event.hebrewDescription}
      </p>
    </div>
  );
}

export const defaultOnMouseEnter = (e) => {
    e.currentTarget.style.padding = '0.4rem 0.8rem';
    e.currentTarget.style.borderRadius = '1rem';
    e.currentTarget.style.backgroundColor = HOVER;
    e.currentTarget.style.transform = MINIMAL_TRANSFORM;
    e.currentTarget.style.transition = MINIMAL_TRANSITION;
}

export const defaultOnMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.color = GRAY;
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.transition = MINIMAL_TRANSITION;
    e.currentTarget.style.padding = '2px 5px';
}

// Function to open Google Maps with the given address
export function handleMaps(address) {
  const query = encodeURIComponent(address, 'Tel-Aviv');
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(url, SELF, NO_OPENER);
}

// Function to open WhatsApp with pre-filled message
export function handleWhatsApp(description) {
        const desc = description || '';
        window.open(`https://wa.me/?text=${encodeURIComponent(`${window.location.href}\n\n${desc}`)}`, SELF, NO_OPENER);
    }

export function handleInstagram(instagram) {
  let url = instagram.trim();
  if (url.startsWith('@')) {
    url = `https://instagram.com/${url.slice(1)}`;
  }
  window.open(url, "_self", "noopener,noreferrer");
}

export function handleCalendar(event) {
    const { title, startDatetime, endDatetime, venue, reservationUrl } = event;
    const start = new Date(startDatetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const end = new Date(endDatetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const details = `For reservations, visit: ${reservationUrl}`;
    const location = venue?.address || '';
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(calendarUrl, SELF, NO_OPENER);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return dateString.split("T")[0];
}
