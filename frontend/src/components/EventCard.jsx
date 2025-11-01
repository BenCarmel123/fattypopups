import React from 'react';
import { Card, Text, IconButton, Button, Drawer } from '@chakra-ui/react';
import { SiGooglecalendar } from "react-icons/si";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TbSend } from "react-icons/tb";
import { AspectRatio } from '@chakra-ui/react';
import { LuSquarePlus } from "react-icons/lu";
import { formatDateRange, handleMaps, handleWhatsApp, handleInstagram, handleCalendar } from './utils';
import { PRIMARY_COLOR, BLACK, WHITE, BACKGROUND_COLOR} from './config/colors.jsx';


// Details drawer component
const Details = ({ eventDetails, eventTitle }) => { 
  return (
    <Drawer.Root> 
        <Text></Text>
        <Drawer.Trigger asChild>
         <Button
           variant="subtle"
           size="2xl" 
           rounded="2xl"
           className="detailsDrawerButton"
           style={{ minHeight: '2.2rem', minWidth: '2.2rem', background: PRIMARY_COLOR, transition: 'background 0.18s' }}
           onMouseOver={e => e.currentTarget.style.background = '#d1d4cc'}
           onMouseOut={e => e.currentTarget.style.background = PRIMARY_COLOR}
         >
          <LuSquarePlus style={{ fontSize: '1.25rem' }} />
         </Button>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="fixed" boxSize="full" />
        <Drawer.Positioner pos="absolute" boxSize="full" padding="2">
          <Drawer.Content>
            <Drawer.Header style={{ position: 'relative', paddingLeft: '2.5rem', backgroundColor: PRIMARY_COLOR }}>
              <Drawer.CloseTrigger asChild>
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body color='gray.600' backgroundColor={BACKGROUND_COLOR} style={{ padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
              <p style={{ whiteSpace: 'pre-line', fontSize: '1.5rem', lineHeight: 1.5, padding: '0 1rem', fontWeight: "bolder" }}>
                {eventDetails}
              </p>
            </Drawer.Body>
            <Drawer.Footer bg={BACKGROUND_COLOR} >
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
    </Drawer.Root>
  )
}

export default function EventCard({ event }) {
  return (
  <Card.Root size="md" overflow="hidden" rounded="lg" style={{ width: '100%', maxWidth: 'clamp(260px, 86vw, 400px)', minWidth: 0, boxSizing: 'border-box', border: '2px solid #e0e4dd', borderRadius: 'clamp(0.75rem, 6vw, 3rem)' }}> 
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
      <Card.Body gap="2" padding="4" bg="#fffbf1"  style={{ lineHeight: 2.5 }}> 
        <Card.Title fontSize="2xl" fontWeight="bolder" color={BLACK} mt={2} mb={1}> {event.title} </Card.Title>
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
      <div style={{ width: '100%', height: '2px', background: PRIMARY_COLOR }} />
      <Card.Footer gap="2" style={{ padding: '1.25rem 2.5rem 1rem 2.5rem', backgroundColor: PRIMARY_COLOR }}> 
        {/* Left group: first three icons aligned to left */}
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0rem', justifyContent: 'flex-start' }}>
          <IconButton variant="subtle" size="2xl" rounded="2xl" color={BLACK} onClick={() => handleCalendar(event)}>
            <SiGooglecalendar />
          </IconButton>
          <IconButton variant="subtle" size="2xl" rounded="2xl" color={BLACK} onClick={() => window.open(event.reservation_url, '_blank', 'noopener,noreferrer')}>
            <FaRegCalendarCheck />
          </IconButton>
          <IconButton variant="subtle" size="2xl" rounded="2xl" color={BLACK} onClick={() => handleWhatsApp(event)}>
            <TbSend />
          </IconButton>
        </div>

        {/* Spacer pushes the right group to the far right */}
        <div style={{ flex: 1 }} />

        {/* Right group: details drawer aligned to right */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', color: BLACK }}>
          <Details eventDetails={event.english_description} eventTitle={event.title}/>
        </div>
      </Card.Footer>
    </Card.Root>
  );
}