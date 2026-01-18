import validator from 'validator';
import { 
  ERR_TITLE_REQUIRED, 
  ERR_START_REQUIRED, 
  ERR_END_REQUIRED, 
  ERR_START_BEFORE_END, 
  ERR_VENUE_INSTAGRAM_REQUIRED, 
  ERR_VENUE_ADDRESS_REQUIRED, 
  ERR_CHEF_NAMES_REQUIRED, 
  ERR_CHEF_INSTAGRAMS_REQUIRED, 
  ERR_RESERVATION_URL_REQUIRED, 
  ERR_ENGLISH_DESC_REQUIRED, 
  ERR_HEBREW_DESC_REQUIRED, 
  ERR_POSTER_REQUIRED, 
  STRING 
} from '../../../config/index.jsx';


// Helper to validate event data based on draft status
export function validateEventSubmission(eventData, isEdit) {
  // For drafts: only validate title
  if (eventData.is_draft) {
    if (!eventData.title || !eventData.title.trim()) {
      return { valid: false, error: ERR_TITLE_REQUIRED };
    }
    return { valid: true };
  }
  
  // For published events: full validation
  return validateEvent(eventData, isEdit);
}

// Helper to validate event data (full validation for published events)
export default function validateEvent(event, isEdit) {
  // Helper to check if string field is valid
  const isValidString = (value) => value && typeof value === STRING && validator.isLength(value.trim(), { min: 1 });
  
  // Helper to check if date is valid
  const isValidDate = (value) => value && !isNaN(Date.parse(value));

  // Define validation rules
  const validations = [
    { check: () => isValidString(event.title), error: ERR_TITLE_REQUIRED },
    { check: () => isValidDate(event.start_datetime), error: ERR_START_REQUIRED },
    { check: () => isValidDate(event.end_datetime), error: ERR_END_REQUIRED },
    { check: () => new Date(event.start_datetime) <= new Date(event.end_datetime), error: ERR_START_BEFORE_END },
    { check: () => isValidString(event.venue_instagram), error: ERR_VENUE_INSTAGRAM_REQUIRED },
    { check: () => isValidString(event.venue_address), error: ERR_VENUE_ADDRESS_REQUIRED },
    { check: () => isValidString(event.chef_names), error: ERR_CHEF_NAMES_REQUIRED },
    { check: () => isValidString(event.chef_instagrams), error: ERR_CHEF_INSTAGRAMS_REQUIRED },
    { check: () => event.reservation_url && validator.isURL(event.reservation_url), error: ERR_RESERVATION_URL_REQUIRED },
    { check: () => isValidString(event.english_description), error: ERR_ENGLISH_DESC_REQUIRED },
    { check: () => isValidString(event.hebrew_description), error: ERR_HEBREW_DESC_REQUIRED },
    { check: () => isEdit || (event.poster && event.poster instanceof File), error: ERR_POSTER_REQUIRED },
  ];

  // Run validations
  for (const validation of validations) {
    if (!validation.check()) {
      return { valid: false, error: validation.error };
    }
  }

  return { valid: true };
}
