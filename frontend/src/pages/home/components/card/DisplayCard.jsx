import DynamicCard from './DynamicCard.jsx';
import EventCard from './EventCard.jsx';

// Main component for displaying an event card with scroll animation
export default function DisplayCard({ event }) {
  return (
    <DynamicCard>
      <EventCard event={event} />
    </DynamicCard>
  );
}
