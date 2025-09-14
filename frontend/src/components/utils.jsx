import validator from 'validator';
import { SMALL, MEDIUM, LARGE } from './strings';
import { MyAlert } from './CustomAlert.jsx';

// Helper to validate event data
export default function validateEvent(event) {
    const { title, start_datetime, end_datetime, venue_instagram, venue_address, chef_names, chef_instagrams, image_url, reservation_url } = event; // No description field
    
    if (!title || !validator.isLength(title.trim(), { min: 1 })) {
        return { valid: false, error: 'Title is required and must be a non-empty string.' };
    }
    // if (!description || !validator.isLength(description.trim(), { min: 1 })) {
    //     return { valid: false, error: 'Description is required and must be a non-empty string.' };
    // }
    if (!start_datetime || isNaN(Date.parse(start_datetime))) {
        return { valid: false, error: 'Start datetime is required and must be a valid date.' };
    }
    if (!end_datetime || isNaN(Date.parse(end_datetime))) {
        return { valid: false, error: 'End datetime is required and must be a valid date.' };
    }
    if (new Date(start_datetime) > new Date(end_datetime)) {
        return { valid: false, error: 'Start datetime must be before end datetime.' };
    }
    if (!venue_instagram || !validator.isLength(venue_instagram.trim(), { min: 1 })) {
        return { valid: false, error: 'Venue Instagram is required and must be a non-empty string.' };
    }
    if (!venue_address || !validator.isLength(venue_address.trim(), { min: 1 })) {
        return { valid: false, error: 'Venue address is required and must be a non-empty string.' };
    }
    if (!Array.isArray(chef_names) || chef_names.length === 0 || chef_names.some(name => !validator.isLength(name.trim(), { min: 1 }))) {
        return { valid: false, error: 'Chef names are required and must be an array of non-empty strings.' };
    }
    if (!Array.isArray(chef_instagrams) || chef_instagrams.length === 0 || chef_instagrams.some(instagram => !validator.isLength(instagram.trim(), { min: 1 }))) {
        return { valid: false, error: 'Chef Instagrams are required and must be an array of non-empty strings.' };
    }
    if (!image_url || !validator.isURL(image_url)) {
        return { valid: false, error: 'Image URL is required and must be a valid URL.' };
    }
    if (!reservation_url || !validator.isURL(reservation_url)) {
        return { valid: false, error: 'Reservation URL is required and must be a valid URL.' };
    }
    return { valid: true };
}

// Helper to format date ranges from start and end dates of events
export function formatDateRange(start, end) {
    if (start && end) {
        return `${new Date(start).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - ${new Date(end).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`;
    } else if (start) {
        return new Date(start).toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
    } else {
        return '';
    }
}

export function getScreenSize() {
    const width = window.innerWidth;
    if (width <= 600) return SMALL;
    if (width <= 900) return MEDIUM;
    return LARGE;
}

// Function to open Google Maps with the given address
export function handleMaps(address) {
  const query = encodeURIComponent(address);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Function to open WhatsApp with pre-filled message
 export function handleWhatsApp(description) {
        const desc = description || '';
        window.open(`https://wa.me/?text=${encodeURIComponent(`${window.location.href}\n\n${desc}`)}`, '_blank');
    }

export function handleInstagram(instagram) {
    const instagramHandle = instagram.startsWith('@') ? instagram.slice(1) : instagram;
    window.open(`https://www.instagram.com/${instagramHandle}`, '_blank', 'noopener,noreferrer');
}