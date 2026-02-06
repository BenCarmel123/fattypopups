import { SELF, NO_OPENER } from '../config/index.jsx';

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
    const { title, start_datetime, end_datetime, venue, reservation_url } = event;
    const start = new Date(start_datetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const end = new Date(end_datetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const details = `For reservations, visit: ${reservation_url}`;
    const location = venue?.address || '';
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(calendarUrl, SELF, NO_OPENER);
}
