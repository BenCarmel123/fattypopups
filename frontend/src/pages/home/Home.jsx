import React, { useState, useEffect } from "react"
import { Spinner } from '@chakra-ui/react';
import DisplayCard from './components/card/DisplayCard.jsx';
import Header from '../../components/Header.jsx';
import InstructionText from './components/InstructionText.jsx';
import EventIndexContext from './context/EventIndexContext.js';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default function HomePage() {
  const [events, setEvents] = useState(null);
  useEffect(() => {
    fetch(`${SERVER_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.log('[ERROR] Error fetching events:', err);
        setEvents([]);
      });
  }, []);

  if (events === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" color="blue.500" />
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="mt-2 w-full flex flex-col items-center px-2 sm:px-4 md:px-8 box-border">
      <InstructionText />
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