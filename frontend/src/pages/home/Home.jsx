import React, { useState, useEffect } from "react"
import { Spinner } from '@chakra-ui/react';
import EventCard from '../../components/EventCard';
import { SUBHEADER_TEXT_1, SUBHEADER_TEXT_2 } from '../../components/config/strings.jsx';
import DynamicCard from '../../components/DynamicCard.jsx';
import Header from '../../components/Header.jsx';

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
      <h2 style={{
      fontSize: '1rem',
      fontWeight: '900',
      color: '#51515b',
      textAlign: 'center',
      margin: '0.5rem',
      width: 'fit-content', 
      backgroundColor: 'transparent',
      padding: '15px',
      marginTop: '2rem',
      marginBottom: '2rem',
    }} >{SUBHEADER_TEXT_1} <br/> {SUBHEADER_TEXT_2} 
    </h2>
      {events.map(evt => (
        <div key={evt.title} className="mb-8 w-full max-w-xl">
          <DynamicCard>
            <EventCard event={evt} />
          </DynamicCard>
        </div>
      ))}
      <div style={{ height: '2.5rem' }} />
    </div>
    </>
  );
}