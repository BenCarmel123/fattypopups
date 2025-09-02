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
import { AspectRatio } from '@chakra-ui/react/aspect-ratio';

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

 function handleWhatsApp(event) {
        const description = event.description || '';
        window.open(`https://wa.me/?text=${encodeURIComponent(`${window.location.href}\n\n${description}`)}`, '_blank');
    }

  function handleMaps(address) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }

function handleGoogleCalendar(event) {
    if (!event) return;
    let dateStr = event.start_datetime;
    const endDateStr = event.end_datetime;
    const eventName = event.title || "Pop Up";
    const location = event.venue_address || "Tel Aviv";
    const now = new Date();
    const startDate = new Date(dateStr);
    if (startDate < now && endDateStr) {
        dateStr = endDateStr;
    }
    const date = new Date(dateStr);
    date.setHours(18, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + 2);
    const startFormatted = date.toISOString().replace(/-|:|\.\d+/g, "");
    const endFormatted = endDate.toISOString().replace(/-|:|\.\d+/g, "");
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` + 
        `&text=${encodeURIComponent(eventName)}` + 
        `&dates=${startFormatted}/${endFormatted}` + 
        `&location=${encodeURIComponent(location)}`;
    window.open(calendarUrl, '_blank');
}

function handleInstagram(event) {
  const handle = event?.chef_instagrams?.[0]?.replace(/^@/, '');
  window.open(
    handle ? `https://instagram.com/${handle}` : INSTA_LINK,
    '_blank',
    'noopener,noreferrer'
  );
}

export default function HomePage() {
   function handleAshamen() {
    window.open(INSTA_LINK, '_blank', 'noopener,noreferrer');
  }
  return (
    <>
    <header className={styles.header}>
      <img
        src="/logo.png"
        alt={APP_NAME}
        className={styles.mainTitle}
      />
      <div className={styles.instaButtonWrapper}>
        <Button colorPalette="blue" variant="ghost" size="2xl" rounded="2xl" onClick={handleAshamen} className={styles.instaButton}>
          <span className={styles.instaButtonIcon}><SiInstagram /></span> {INSTA_TEXT}
        </Button>
      </div>
      <Credentials />
    </header>
    <div className={`${styles.centeredContent} centered-content`} style={{ marginTop: '0.5rem' }}>
      <RadioCard.Root defaultValue="next">
      </RadioCard.Root>
      <div style={{ height: '1rem' }} />
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
           <AspectRatio ratio={12 / 12}>
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
          </AspectRatio>
          <Card.Body gap="2" padding="6">
            <Card.Title fontSize="2xl"> {event.title} </Card.Title>
            <Card.Description fontSize="lg" color="gray.600">
              {event.chef_names && Array.isArray(event.chef_names) ? event.chef_names.join(' X ') : ''}
              <br/>
              <p className={styles.eventLocation} onClick={() => handleMaps(event.venue_address)}>{event.venue_address}</p>
              
              <br/>
              {formatDateRange(event.start_datetime, event.end_datetime)}
            </Card.Description>
            <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
            </Text>
          </Card.Body>
          <Card.Footer gap="2" className={styles.carouselFooterIcons} style={{ justifyContent: 'flex-start', padding: '0 2.5rem 2.5rem 2.5rem' }}>
            <Footer event={event}/>
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
  const Footer = ( {event} ) => {
      return (
        <div className={styles.carouselFooterIcons}>
          <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleGoogleCalendar(event)} className={styles.iconButton}>
            <span className={styles.iconButtonIcon}><SiGooglecalendar /></span>
          </IconButton>
          <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleWhatsApp(event)} className={styles.iconButton}>
            <span className={styles.iconButtonIcon}><SiWhatsapp /></span>
          </IconButton>
          <IconButton variant="outline" size="2xl" rounded="2xl" className={styles.iconButton}>
            <span className={styles.iconButtonIcon} onClick={() => handleInstagram(event)}><SiInstagram /></span>
          </IconButton>
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
