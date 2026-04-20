import React, { useState, useEffect } from "react"
import { Spinner } from '@chakra-ui/react';
import DisplayCard from './components/card/DisplayCard.jsx';
import Header from './components/header/Header.jsx';
import HomeBanner from './components/header/HomeBanner.jsx';
import EventIndexContext from './context/EventIndexContext.js';
import { handleTokenCheck } from "utils/auth.js";
import { fetchEvents } from "controller/events.js";
import { logger } from "utils/logger.js";

export default function HomePage() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(err => {
        logger.error('Error fetching events:', err);
        setEvents([]);
      });
  }, []);

  useEffect(() => {
    if (!events) return;
    const eventId = new URLSearchParams(window.location.search).get('event');
    if (eventId) {
      document.getElementById(`event-${eventId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [events]);

  if (events === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" color="blue.500" />
      </div>
    );
  }

  return (
    <>
    <Header token={handleTokenCheck} />
    <div className="mt-2 w-full flex flex-col items-center px-2 sm:px-4 md:px-8 box-border">
      <HomeBanner />
      {events.map((evt, index) => (
        <EventIndexContext.Provider key={evt.title} value={index}>
          <div className="mb-8 w-full max-w-xl relative">
            <DisplayCard event={evt} />
          </div>
        </EventIndexContext.Provider>
      ))}
      <div style={{ height: '2.5rem' }} />
    </div>
    </>
  );
}