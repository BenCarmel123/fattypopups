import styles from '../home/home.module.css';
import React, { useState, useEffect } from "react"
import { APP_NAME, INSTA_LINK, INSTA_TEXT, SERVER_URL } from '../../Config';
import { ADMIN_ROUTE } from '../../adminRoute';
import { Button, Text } from '@chakra-ui/react';
import { SiInstagram} from "react-icons/si";
import { RiMailLine } from "react-icons/ri";
import EventCard from '../../components/EventCard';
import { Instagram } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white/90 border-b border-white-100 px-8 py-4">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold bg-[#9bc2c3] bg-clip-text text-transparent tracking-normal">
          fattypopups
        </h1>
        
        <Button
          variant="ghost"
          className="text-[#9bc2c3] font-bold gap-1 transition-all duration-200 bg-blue-50 hover:bg-blue-200 hover:text-[#ffffff] px-4 rounded-2xl"
          onClick={() => window.open('https://instagram.com/ben_ashamen', '_blank')}
        >
          <Instagram className="w-6 h-6" />
          @ben_ashamen
        </Button>
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
  
   function handleAshamen() {
    window.open(INSTA_LINK, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
    <Header />
    <Admin />
    {/* Event cards */}
    <div style={{ marginTop: '0.5rem', width: '100vw', maxWidth: '100vw', boxSizing: 'border-box', padding: 0 }}>
      {events.map(evt => (
        <div key={evt.title} style={{ marginBottom: '2rem', width: '80', maxWidth: '100vw', boxSizing: 'border-box', padding: 0 }}>
          <EventCard event={evt} />
        </div>
      ))}
      <div style={{ height: '2.5rem' }} />
      {/* <Carousel /> */}
    </div>
    </>
  );
}