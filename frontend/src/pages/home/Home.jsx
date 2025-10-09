import styles from '../home/home.module.css';
import React, { useState, useEffect } from "react"
import { SERVER_URL, ABOUT_ROUTE } from '../../Config';
import { ADMIN_ROUTE } from '../../adminRoute';
import { Button, Text } from '@chakra-ui/react';
import { RiMailLine } from "react-icons/ri";
import EventCard from '../../components/EventCard';

function handleRoute(route) {
  window.location.href = "/" + route;
}

const Admin = () => { 
  function handleAdmin() {
    handleRoute(ADMIN_ROUTE);
  }
  return (
    <>
      <div className={styles.adminCorner}>
        <Button
          className={styles.adminCornerButton}
          colorScheme="teal"
          variant="ghost"
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: 'transparent', boxShadow: 'none', opacity: 0.7 }}
          onClick={handleAdmin}
        >
          <RiMailLine /> Admin
        </Button>
      </div>
    </>
  );
}

const About = () => {
  function handleAbout() {
    window.location.href = "/" + ABOUT_ROUTE;
  }
  return (
    <div className="fixed top-4 right-6 z-50">
      <Button
        variant="ghost"
        colorScheme="teal"
        size="md"
        className="bg-transparent shadow-none opacity-70 hover:opacity-100 transition-opacity duration-150"
        onClick={handleAbout}
      >
       About
      </Button>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#e0e4dd] border-b border-white-100 px-16 py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
      </div>
      <About />
    </header>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState(null);
  
  useEffect(() => {
    fetch(`${SERVER_URL}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error fetching events:', err));
  }, []);
  
  // While loading
  if (events === null) {
    return <Text> Ben </Text>;
  }
  // If no events, show message
  if (events.length === 0) {
    return <Text>No events available.</Text>;
  } 
  
  return (
    <>
    <Header />
    <Admin />
    {/* Event cards */}
    <div className="mt-2 w-full flex flex-col items-center px-2 sm:px-4 md:px-8 box-border">
      {events.map(evt => (
        <div key={evt.title} className="mb-8 w-full max-w-xl">
          <EventCard event={evt} />
        </div>
      ))}
      <div style={{ height: '2.5rem' }} />
      {/* <Carousel /> */}
    </div>
    </>
  );
}