import React from 'react';
import { Card, Text, IconButton, Button, Drawer, CloseButton } from '@chakra-ui/react';
import { SiInstagram, SiGooglecalendar, SiWhatsapp } from "react-icons/si";
import { IoAdd } from "react-icons/io5";
import { AspectRatio } from '@chakra-ui/react';
import { formatDateRange, handleMaps, handleWhatsApp, handleInstagram, handleCalendar } from './utils';
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
      <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleInstagram(event.venue_instagram)}>
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
           size="md" // smaller button
           rounded="xl"
           className="detailsDrawerButton bg-blue-200 hover:bg-blue-300 text-blue-900 shadow-lg border-2 border-blue-400 transition-all duration-200 px-3 py-2 text-lg flex items-center gap-2"
           style={{ minHeight: '2.2rem', minWidth: '2.2rem' }}
         >
          <IoAdd style={{ marginRight: '0.3rem', fontSize: '1.2rem' }} />
         </Button>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="absolute" boxSize="full" />
        <Drawer.Positioner pos="absolute" boxSize="full" padding="2">
          <Drawer.Content>
            <Drawer.Header style={{ position: 'relative', paddingLeft: '2.5rem' }}>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="lg" style={{ position: 'absolute', left: '0.5rem', top: '0.5rem', marginRight: '1.5rem' }} />
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
    <Card.Root className={styles.carouselCard} size="md" overflow="hidden" rounded="lg" style={{ width: '100%', maxWidth: '400px', minWidth: 0, boxSizing: 'border-box' }}>
      <AspectRatio ratio={12 / 12}>
        <img
          src={event.image_url}
          alt={event.title}
          style={{
            width: '100%',
            maxWidth: '400px',
            minWidth: 0,
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </AspectRatio>
      <Card.Body gap="2" padding="4">
        <Card.Title fontSize="xl"> {event.title} </Card.Title>
        <Card.Description fontSize="md" color="gray.600">
          {event.chef_names && Array.isArray(event.chef_names) ? event.chef_names.join(' X ') : ''}
          <br/>
          <p
            className="underline cursor-pointer"
            onClick={() => handleMaps(event.venue_address)}
          >
            {event.venue_address}
          </p>
          <br/>
          {formatDateRange(event.start_datetime, event.end_datetime)}
        </Card.Description>
        <Text textStyle="lg" fontWeight="medium" letterSpacing="tight" mt="2">
        </Text>
      </Card.Body>
      <Card.Footer gap="2" className={styles.carouselFooterIcons} style={{ justifyContent: 'flex-start', padding: '0 1.5rem 1.5rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginRight: '0.5rem' }}>
          <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleCalendar(event)}>
            <SiGooglecalendar />
          </IconButton>
          <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleWhatsApp(event)}>
            <SiWhatsapp />
          </IconButton>
          <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleInstagram(event)}>
            <SiInstagram />
          </IconButton>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', marginRight: '-1rem' }}>
            <Details eventDetails={event.description} eventTitle={event.title}/>
          </div>
        </div>
      </Card.Footer>
    </Card.Root>
  );
}