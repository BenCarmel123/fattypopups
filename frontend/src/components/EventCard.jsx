import React from 'react';
import { Card, Text, IconButton, Button, Drawer, CloseButton } from '@chakra-ui/react';
import { SiInstagram, SiGooglecalendar, SiWhatsapp } from "react-icons/si";
import { IoAdd } from "react-icons/io5";
import { AspectRatio } from '@chakra-ui/react';
import { formatDateRange, handleMaps, handleWhatsApp, handleInstagram } from './utils';
import styles from '../pages/home/home.module.css';

// Helper for footer icons
const Footer = ({ event }) => {
  return (
    <div style={{ display: 'flex', gap: '3rem' }}>
      <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleMaps(event.venue_address)}>
        <SiGooglecalendar />
      </IconButton>
      <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleWhatsApp(event)}>
        <SiWhatsapp />
      </IconButton>
      <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleInstagram(event)}>
        <SiInstagram />
      </IconButton>
    </div>
  );
}

// Details drawer component
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

export default function EventCard({ event }) {
  return (
    <Card.Root className={styles.carouselCard} size="2xl" overflow="hidden" rounded="lg" style={{ width: '100vw', maxWidth: '100vw', minWidth: 0, boxSizing: 'border-box' }}>
      <Details eventDetails={event.description} eventTitle={event.title}/>
      <AspectRatio ratio={12 / 12}>
        <img
          src={event.image_url}
          alt={event.title}
          style={{
            width: '100vw',
            maxWidth: '100vw',
            minWidth: 0,
            height: '300px',
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
  );
}