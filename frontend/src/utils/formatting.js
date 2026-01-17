import { SHORT, NUMERIC } from '../config/index.jsx';

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
      <p style={{ direction: 'ltr', unicodeBidi: 'isolate', textAlign: 'left', letterSpacing: '1.2px' }}>{event.english_description}</p>
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
        {event.hebrew_description}
      </p>
    </div>
  );
}

export function formatDate(dateString) {
  if (!dateString) return "";
  return dateString.split("T")[0];
}
