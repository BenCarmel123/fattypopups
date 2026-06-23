import React from "react"
import { Spinner } from '@chakra-ui/react';
import DisplayCard from './components/card/DisplayCard.jsx';
import Header from './components/header/Header.jsx';
import HomeBanner from './components/header/HomeBanner.jsx';
import EventIndexContext from './context/EventIndexContext.js';
import { handleTokenCheck } from "utils/auth.js";
import { useEvents } from './hooks/useEvents.js';
import * as Config from 'config/index.jsx';
import * as Classes from 'config/classes.jsx';

export default function HomePage() {
  const events = useEvents();

  if (events === null) {
    return (
      <div className={Classes.HOME_SPINNER_WRAPPER}>
        <Spinner size={Config.XL} color="blue.500" />
      </div>
    );
  }

  return (
    <>
    <Header token={handleTokenCheck} />
    <div className={Classes.HOME_PAGE}>
      <HomeBanner />
      {events.map((evt, index) => (
        <EventIndexContext.Provider key={evt.title} value={index}>
          <div className={Classes.HOME_CARD_WRAPPER}>
            <DisplayCard event={evt} />
          </div>
        </EventIndexContext.Provider>
      ))}
      <div style={{ height: '2.5rem' }} />
    </div>
    </>
  );
}