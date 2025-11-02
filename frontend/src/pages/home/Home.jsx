import React, { useState, useEffect } from "react"
import { Button, Spinner } from '@chakra-ui/react';
import { RiMailLine } from "react-icons/ri";
import EventCard from '../../components/EventCard';
import { SECONDARY_COLOR, BLACK } from '../../components/config/colors.jsx';
import { APP_NAME } from '../../components/config/strings.jsx';


// Replace imports from Config.jsx with process.env variables
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const ABOUT_ROUTE = process.env.REACT_APP_ABOUT_ROUTE;
const ADMIN_ROUTE = process.env.REACT_APP_ADMIN_ROUTE;

function handleRoute(route) {
  window.location.href = "/" + route;
}

// Admin button component - for development purposes
const Admin = () => { 
  function handleAdmin() {
    handleRoute(ADMIN_ROUTE);
  }
  return (
    <>
      <div>
        <Button
          variant="subtle"
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: 'transparent', boxShadow: 'none', opacity: 0.7, _hover: { background: SECONDARY_COLOR, color: 'white' } }}
          onClick={handleAdmin}>
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
    <div className="flex items-center">
      <Button
        variant="solid"
        size="md"
        color={BLACK}
        fontWeight="bold"
        px={8}
        py={6}
        boxShadow="sm"
        borderRadius="xl"
        _hover={{ bg: SECONDARY_COLOR, color: 'white', transform: 'scale(1.05)' }}
        transition="all 0.15s"
        onClick={handleAbout}
      >
        About
      </Button>
    </div>
  );
};

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#e0e4dd] border-b border-white-100 px-16 py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <h1 className="text-[25px] font-bold" style={{ color: SECONDARY_COLOR }}> {APP_NAME} </h1>
        <About />
      </div>
    </header>
  );
}

export default function HomePage() {
  const [events, setEvents] = useState(null);
  
  useEffect(() => {
    fetch(`${SERVER_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched events:', data); // Debugging log
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching events:', err);
        setEvents([]); // Fallback to an empty array on error
      });
  }, []);
  
  // While loading
  if (events === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" color="blue.500" />
      </div>
    );
  }
  // If no events, blank page
  if (events.length === 0) {
    return <></>;
  } 
  
  return (
    <>
    <Header />
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