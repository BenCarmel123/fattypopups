import styles from '../home/home.module.css';
import React, { useState, useEffect } from "react"
import { APP_NAME, INSTA_LINK, INSTA_TEXT, SERVER_URL } from '../../Config';
import { ADMIN_ROUTE } from '../../adminRoute';
import { Button, RadioCard, Card, Text, IconButton, Drawer, CloseButton } from '@chakra-ui/react';
import { SiInstagram, SiGooglecalendar } from "react-icons/si";
import { LuPhone } from "react-icons/lu";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { TfiArrowCircleRight, TfiArrowCircleLeft } from "react-icons/tfi";
import { CiSquareMore } from "react-icons/ci";
import { RiMailLine } from "react-icons/ri";
import { formatDateRange } from '../../components/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Credentials() {
  function handleInstagram() {
    window.open(INSTA_LINK, '_blank', 'noopener,noreferrer');
  }

  function handleAdmin() {
    window.location.href = "/" + ADMIN_ROUTE;
  }
  return (
    <>
      <div className={styles.credentials}>
        <Button
          className={styles.adminCornerButton}
          colorScheme="teal"
          variant="ghost"
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, background: 'transparent', boxShadow: 'none', opacity: 0.7 }}
          onClick={handleAdmin}
        >
          <RiMailLine /> Admin
        </Button>
        <Button colorPalette="blue" variant="ghost" rounded="lg" onClick={handleInstagram}>
          <SiInstagram/> {INSTA_TEXT}
        </Button>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <>
    <header className={styles.header}>
      <img
        src="/logo.png"
        alt={APP_NAME}
        className={styles.mainTitle}
        style={{ height: '8rem', objectFit: 'contain' }}
      />
      <Credentials />
    </header>
    <div className={`${styles.centeredContent} centered-content`}>
      <RadioCard.Root defaultValue="next">
      </RadioCard.Root>
      <div style={{ height: '2.5rem' }} />
      <Carousel />
    </div>
    </>
  );
}

const Carousel = () => {
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
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

  // Show only the current event  
  const event = events[currentEventIndex];

  return (
    <div className={styles.carouselWrapper} style={{ marginTop: '1.5rem' }}>
      <RenderArrow direction="left" nextEvent={setCurrentEventIndex} events={events} current={currentEventIndex}/>
        <Card.Root className={styles.carouselCard} size="2xl" overflow="hidden" rounded="lg" >
          <img
            src={event.image_url}
            alt={event.title}
            style={{
              width: '100%',
              height: '300px%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <Details eventDetails={event.description} eventTitle={event.title}/>
          <Card.Body gap="2" padding="6">
            <Card.Title fontSize="2xl"> {event.title} </Card.Title>
            <Card.Description fontSize="lg" color="gray.600">
              {event.chef_names && Array.isArray(event.chef_names) ? event.chef_names.join(' X ') : ''}
              <br/>
              {event.venue_address} 
              <br/>
              {formatDateRange(event.start_datetime, event.end_datetime)}
            </Card.Description>
            <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
            </Text>
          </Card.Body>
          <Card.Footer gap="2" className={styles.carouselFooterIcons}>
            <Footer />
          </Card.Footer>
        </Card.Root>
      <RenderArrow direction="right" nextEvent={setCurrentEventIndex} events={events} current={currentEventIndex}/>
    </div>
  );
}

export { Carousel };

// Carousel component helpers

// Render Arrow component
  function RenderArrow ( {direction, nextEvent, events, current} ) {
    const ChevronIcon = direction === 'left' ? ChevronLeft : ChevronRight;
    return (
      <ChevronIcon
        className={styles.carouselArrow}
        variant="subtle"
        size="lg"
        color="blue"
        style={direction === 'left' ? { left: '-4.5rem' } : { right: '-4.5rem' }}
        _hover={{ background: 'blue.400', color: 'white' }}
        _active={{ background: 'blue.600', color: 'white' }}
        aria-label={direction === 'left' ? 'Previous' : 'Next'}
        onClick={() => {
          if (!events.length) return;
          nextEvent(() => {
            const len = events.length;
            return direction === 'left'
              ? (current - 1 + len) % len
              : (current + 1) % len;
          });
        }}
      />
    );
  }
  
  // Helper for footer icons
  const Footer = () => {
      return (
        <>
          <IconButton variant="outline" size="xl" rounded="2xl"> <SiGooglecalendar /> </IconButton>
          <IconButton variant="outline" size="xl" rounded="2xl"> <FaRegShareFromSquare /> </IconButton>
          <IconButton variant="outline" size="xl" rounded="2xl"> <SiInstagram /> </IconButton>
        </>
      );
  }

const Details = ({ eventDetails, eventTitle }) => { 
  return (
    <Drawer.Root> 
        <Text></Text>
        <Drawer.Trigger asChild>
         <Button
           variant="outline"
           size="m"
           rounded="2xl"
           className={styles.detailsDrawerButton}
         >
           <CiSquareMore />
         </Button>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="absolute" boxSize="full" />
        <Drawer.Positioner pos="absolute" boxSize="full" padding="4">
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title> {eventTitle} </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <p>
                {eventDetails}
              </p>
            </Drawer.Body>
            <Drawer.Footer>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
    </Drawer.Root>
  )
}
