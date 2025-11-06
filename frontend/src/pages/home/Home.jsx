import React, { useState, useEffect } from "react"
import { Button, Spinner } from '@chakra-ui/react';
import EventCard from '../../components/EventCard';
import { SECONDARY_COLOR, DRAWER_DETAILS_FONT_COLOR, HEADER_BACKGROUND_COLOR } from '../../components/config/colors.jsx';
import { APP_NAME } from '../../components/config/strings.jsx';
import { GrCircleInformation } from "react-icons/gr";

// Replace imports from Config.jsx with process.env variables
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const ABOUT_ROUTE = process.env.REACT_APP_ABOUT_ROUTE;
const LOGO_URL = process.env.REACT_APP_LOGO;

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
        <GrCircleInformation style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} />
      </Button>
    </div>
  );
};

export function Header() {
  return (
  <header className="sticky top-0 z-50 border-b border-white-100 px-6 md:px-16 py-[0.01rem] md:py-[0.35rem]" style={{ backgroundColor: HEADER_BACKGROUND_COLOR }} >
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <div className="flex items-center">
          {LOGO_URL ? (
            <a aria-label={APP_NAME} className="flex items-center">
              <img src={LOGO_URL} alt={APP_NAME} className="h-42 w-40 object-contain" />
            </a>
          ) : (
            <a href="/" className="text-lg font-bold" aria-label={APP_NAME}>{APP_NAME}</a>
          )}
        </div>

        <div>
          <About />
        </div>
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