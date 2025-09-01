import styles from '../home/home.module.css';
import React, { useState, useEffect } from "react"
import { APP_NAME, INSTA_LINK, INSTA_TEXT, SERVER_URL } from '../../Config';
import { ADMIN_ROUTE } from '../../adminRoute';
import { Button, RadioCard, Card, Text, IconButton, Drawer, CloseButton, chakra } from '@chakra-ui/react';
import { SiInstagram, SiGooglecalendar, SiWhatsapp } from "react-icons/si";
import { RiMailLine } from "react-icons/ri";
import { formatDateRange } from '../../components/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IoAdd } from "react-icons/io5";

function Credentials() {

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
      </div>
    </>
  );
}

export default function HomePage() {
   function handleInstagram() {
    window.open(INSTA_LINK, '_blank', 'noopener,noreferrer');
  }
  return (
    <>
    <header className={styles.header}>
      <img
        src="/logo.png"
        alt={APP_NAME}
        className={styles.mainTitle}
        style={{ height: '12rem', objectFit: 'contain' }}
      />
      <Button size="2xl" colorPalette="blue" variant="ghost" rounded="lg" onClick={handleInstagram} style={{ margin: '1.5rem 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <SiInstagram size="2xl" /> {INSTA_TEXT}
      </Button>
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
    <div className={styles.carouselWrapper} style={{ marginTop: '1.5rem', boxShadow: '0 8px 16px rgb(201, 197, 197)', borderRadius: '2rem', background: 'white' }}>
      <RenderArrow direction="left" nextEvent={setCurrentEventIndex} events={events} current={currentEventIndex}/>
        <Card.Root className={styles.carouselCard} size="2xl" overflow="hidden" rounded="lg" >
           <Details eventDetails={event.description} eventTitle={event.title}/>
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
          <Card.Footer gap="2" className={styles.carouselFooterIcons} style={{ justifyContent: 'flex-start', padding: '0 2.5rem 2.5rem 2.5rem' }}>
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
        <div style={{ display: 'flex', gap: '3rem' }}>
          <IconButton variant="outline" size="2xl" rounded="2xl"> <SiGooglecalendar /> </IconButton>
          <IconButton variant="outline" size="2xl" rounded="2xl"> <SiWhatsapp /> </IconButton>
          <IconButton variant="outline" size="2xl" rounded="2xl"> <SiInstagram /> </IconButton>
        </div>
      );
  }

const Details = ({ eventDetails, eventTitle }) => { 
  return (
    <Drawer.Root> 
        <Text></Text>
        <Drawer.Trigger asChild>
         <Button
           variant="subtle"
           size="m"
           rounded="m"
           className={styles.detailsDrawerButton}
           style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.5rem', paddingLeft: '1rem' }}
         >
          <IoAdd style={{ marginRight: '0.5rem' }} />
         </Button>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="absolute" boxSize="full" />
        <Drawer.Positioner pos="absolute" boxSize="full" padding="4">
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="lg" style={{ position: 'absolute', left: '1rem', top: '1rem' }} />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <p className={styles.detailsDrawerText}>
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
