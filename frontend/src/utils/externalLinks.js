import * as Config from '../config/index.jsx';
import { formatDateRange } from './formatting.jsx';

export function handleMaps(address) {
  const query = encodeURIComponent(address, 'Tel-Aviv');
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(url, Config.BLANK, Config.NO_OPENER);
}

function buildWhatsAppMessage(event) {
  const { id, title, start_datetime, end_datetime, venue, reservation_url } = event;
  const dateRange = formatDateRange(start_datetime, end_datetime);
  return `https://fattypopups.com?event=${id}\n\n${title}\n${dateRange}\n${venue?.name || ''}\n\nReserve: ${reservation_url}`;
}

export function handleWhatsApp(event) {
  const text = buildWhatsAppMessage(event);
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, Config.BLANK, Config.NO_OPENER);
}

export function handleInstagram(instagram) {
  let url = instagram.trim();
  if (url.startsWith('@')) {
    url = `https://instagram.com/${url.slice(1)}`;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

export function handleCalendar(event) {
    const { title, start_datetime, end_datetime, venue, reservation_url } = event;
    const start = new Date(start_datetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const end = new Date(end_datetime).toISOString().replace(/-|:|\.\d\d\d/g,"");
    const details = `For reservations, visit: ${reservation_url}`;
    const location = venue?.address || '';
    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
    window.open(calendarUrl, Config.BLANK, Config.NO_OPENER);
}
