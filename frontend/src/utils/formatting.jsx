import * as Config from 'config/index.jsx';

export function formatDateRange(start, end) {
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
    const sameDay = startDate.getDate() === endDate.getDate() && startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const startMonth = capitalize(startDate.toLocaleDateString(undefined, { month: Config.LONG }));
    const endMonth = capitalize(endDate.toLocaleDateString(undefined, { month: Config.LONG }));
    if (sameDay) {
      return `${startMonth} ${startDate.getDate()}`;
    }
    const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear();
    if (sameMonth) {
      return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}`;
    } else {
      return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`;
    }
  } else if (start) {
  const d = new Date(start);
  const m = capitalize(d.toLocaleDateString(undefined, { month: Config.LONG }));
  return `${m} ${d.getDate()}`;
  } else {
        return '';
    }
}

export function formatEventDescription(event) {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'center', marginBottom: '8px', background: Config.HERO_TEAL_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{event.title}</h2>
      <p style={{ direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'left', letterSpacing: '1.2px' }}>{event.english_description}</p>
    </div>
  );
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return dateString.split("T")[0];
}

export function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}
