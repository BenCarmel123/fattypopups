import styles from '../home/home.module.css';
import React, { useState, useEffect } from "react"
import { SERVER_URL } from '../../Config';
import { ADMIN_ROUTE } from '../../adminRoute';
import { Button, Text } from '@chakra-ui/react';
import { RiMailLine } from "react-icons/ri";
import EventCard from '../../components/EventCard';

const Admin = () => {
  
  function handleAdmin() {
    window.location.href = "/" + ADMIN_ROUTE;
  }
  return (
    <>
      <div className={styles.adminCorner}>
        <Button
          className={styles.adminCornerButton}
          colorScheme="teal"
          variant="ghost"
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, background: 'transparent', boxShadow: 'none', opacity: 0.7 }}
          onClick={handleAdmin}
        >
          <RiMailLine /> Admin
        </Button>
      </div>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#e0e4dd] border-b border-white-100 px-16 py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {/* <h1 className="text-2xl font-extrabold bg-[#9bc2c3] bg-clip-text text-transparent tracking-normal">
          fattypopups
        </h1> */}
        
        {/* <Button
          variant="ghost"
          className="text-[#9bc2c3] font-bold gap-1 transition-all duration-200 bg-blue-50 hover:bg-blue-200 hover:text-[#ffffff] px-4 rounded-2xl"
          onClick={() => window.open('https://instagram.com/ben_ashamen', '_blank')}
        >
          <Instagram className="w-6 h-6" />
          @ben_ashamen
        </Button> */}
      </div>
    </header>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    fetch(`${SERVER_URL}/api/events`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Error fetching events:', err));
  }, []);
  
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