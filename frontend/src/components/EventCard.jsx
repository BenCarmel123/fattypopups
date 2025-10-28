import React from 'react';
import { Card, Text, IconButton, Button, Drawer, CloseButton } from '@chakra-ui/react';
import { SiGooglecalendar } from "react-icons/si";
import { FaRegShareFromSquare } from "react-icons/fa6";
import { FaCalendarCheck } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { AspectRatio } from '@chakra-ui/react';
import { formatDateRange, handleMaps, handleWhatsApp, handleInstagram, handleCalendar } from './utils';
import {CENTER, FLEX} from './config/strings';

// Details drawer component
const Details = ({ eventDetails, eventTitle }) => { 
  return (
    <Drawer.Root> 
        <Text></Text>
        <Drawer.Trigger asChild>
         <Button
           variant="subtle"
           size="xl" // even larger
           rounded="xl"
           className="detailsDrawerButton"
           style={{ minHeight: '2.2rem', minWidth: '2.2rem', background: '#e0e4dd', borderColor: '#58565d', borderWidth: 2, transition: 'background 0.18s' }}
           onMouseOver={e => e.currentTarget.style.background = '#d1d4cc'}
           onMouseOut={e => e.currentTarget.style.background = '#e0e4dd'}
         >
          <IoAdd style={{ marginRight: '0.3rem', fontSize: '1.2rem' }} />
         </Button>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="absolute" boxSize="full" />
        <Drawer.Positioner pos="absolute" boxSize="full" padding="2">
          <Drawer.Content>
            <Drawer.Header style={{ position: 'relative', paddingLeft: '2.5rem', backgroundColor: '#e0e4dd' }}>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="xs" style={{ position: 'absolute', left: '0.5rem', top: '0.5rem', marginRight: '20rem', backgroundColor: '#8b0000', color: 'white'}} />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body color='gray.600'>
              <p style={{ whiteSpace: 'pre-line', fontSize: '1.5rem', lineHeight: 1.5, padding: '0 1rem', fontWeight: "bolder" }}>
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
    <Card.Root size="md" overflow="hidden" rounded="lg" style={{ width: '100%', maxWidth: '400px', minWidth: 0, boxSizing: 'border-box', border: '2px solid #e0e4dd', borderRadius: '3rem 3rem 3rem 3rem' }}> 
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
      <Card.Body gap="2" padding="4" bg="#fffbf1" style={{ lineHeight: 2.5 }}> 
        <Card.Title fontSize="2xl" fontWeight="bolder" mt={2} mb={1}> {event.title} </Card.Title>
        <Card.Description fontSize="xl" color="gray.600" fontWeight="bold">
          {event.chef_names && Array.isArray(event.chef_names) && Array.isArray(event.chef_instagrams)
            ? event.chef_names.map((name, idx) => (
                <span
                  key={name}
                  style={{ textDecoration: 'underline', cursor: 'pointer', marginRight: idx < event.chef_names.length - 1 ? 4 : 0 }}
                  onClick={() => handleInstagram(event.chef_instagrams[idx])}
                >
                  {name}
                </span>
              )).reduce((prev, curr, idx) => prev === null ? [curr] : [...prev, <span key={`x-${idx}`}> X </span>, curr], null)
            : ''}
          <br/>
          {formatDateRange(event.start_datetime, event.end_datetime)}
          <br/>
          <span className="underline cursor-pointer" onClick={() => handleMaps(event.venue_address)}>
            {event.venue_address}
          </span>
        </Card.Description>
      </Card.Body>
      <div style={{ width: '100%', height: '2px', background: '#e0e4dd' }} />
      <Card.Footer gap="2" style={{ justifyContent: 'space-between', padding: '1.25rem 2.5rem 1rem 2.5rem', backgroundColor: '#e0e4dd'}}> 
        <div style={{ display: FLEX, gap: '1.2rem', alignItems: CENTER, width: '100%', justifyContent: 'space-between', marginRight: 0 }}>
          <IconButton variant="outline" size="2xl" rounded="xl" onClick={() => handleCalendar(event)}>
            <SiGooglecalendar />
          </IconButton>
          <IconButton variant="outline" size="2xl" rounded="xl" onClick={() => window.open(event.reservation_url, '_blank', 'noopener,noreferrer')}>
            <FaCalendarCheck />
          </IconButton>
          <IconButton variant="outline" size="2xl" rounded="2xl" onClick={() => handleWhatsApp(event)}>
            <FaRegShareFromSquare />
          </IconButton>
          <div style={{ display: FLEX, alignItems: CENTER, height: '100%' }}>
            <Details eventDetails={event.english_description} eventTitle={event.title}/>
          </div>
        </div>
      </Card.Footer>
    </Card.Root>
  );
}