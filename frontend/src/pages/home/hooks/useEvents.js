import { useState, useEffect } from "react";
import { fetchEvents } from "controller/events.js";
import { logger } from "utils/logger.js";

export function useEvents() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(err => {
        logger.error('Error fetching events:', err);
        setEvents([]);
      });
  }, []);

  return events;
}
