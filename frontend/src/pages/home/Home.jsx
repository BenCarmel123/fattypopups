import React, { useState, useEffect } from "react"
import { Button, Spinner } from '@chakra-ui/react';
import EventCard from '../../components/EventCard';
import { HOVER, HEADER_BACKGROUND_COLOR, GRAY, WHITE, BORDER_COLOR, SUB_HEADER_BACKGROUND_COLOR} from '../../components/config/colors.jsx';
import { APP_NAME, MINIMAL_TRANSFORM, SOLID, XL, ABOUT_BUTTON_TEXT, SMALL, MINIMAL_TRANSITION, SUBHEADER_TEXT_1, SUBHEADER_TEXT_2, BORDER_WIDTH } from '../../components/config/strings.jsx';
import DynamicCard from '../../components/DynamicCard.jsx';

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
        variant={SOLID}
        size={SMALL}
        color={GRAY}
        px={4}
        py={4}
        boxShadow={SMALL}
        borderRadius={XL}
        borderColor='#cde6e5'
        borderStyle='solid'
        borderWidth={BORDER_WIDTH}
        _hover={{ bg: HOVER, color: WHITE, transform: MINIMAL_TRANSFORM }}
        transition={MINIMAL_TRANSITION}
        onClick={handleAbout}
      >
        {ABOUT_BUTTON_TEXT}
      </Button>
    </div>
  );
};

export function Header() {
  return (
  <header className="top-0 z-50 px-6 md:px-16 py-[0.01rem] md:py-[0.35rem]" style={{ backgroundColor: HEADER_BACKGROUND_COLOR, borderBottom: `1px solid ${BORDER_COLOR}` }} >
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <div className="flex items-center">
          {LOGO_URL ? (
            <a aria-label={APP_NAME} className="flex items-center">
              <img src={LOGO_URL} alt={APP_NAME} className="h-42 w-40 object-contain" style={{width:'7rem'}} />
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
        <Spinner size={XL} color="blue.500" />
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
    <div className="mt-2 w-full flex flex-col items-center px-2 sm:px-4 md:px-8 box-border">
      <h2 style={{
      fontWeight: 'bolder',
      color: '#51515b',
      textAlign: 'center',
      margin: '1rem',
      width: 'fit-content', 
      backgroundColor: 'transparent',
      padding: '15px',
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