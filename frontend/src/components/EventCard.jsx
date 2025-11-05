import React from 'react';
import { Card, Text, Drawer } from '@chakra-ui/react';
import { formatDateRange, handleMaps, handleWhatsApp, handleInstagram, handleCalendar, formatEventDescription } from './utils';
import { PRIMARY_COLOR, BACKGROUND_COLOR, DRAWER_DETAILS_FONT_COLOR} from './config/colors.jsx';
import { RiInstagramFill } from "react-icons/ri";
import { SiGooglemaps } from "react-icons/si";
import { RESERVE, DETAILS, SHARE } from './config/strings';


// Details drawer component
function ActionButton({ children, onClick, ariaLabel, className = '' }) {
  return (
    <Button
      variant="subtle"
      size="xl"
      rounded="2xl"
      className={`detailsDrawerButton ${className}`}
    style={{ color: SECONDARY_COLOR, minHeight: '2.6rem', minWidth: '2.2rem', padding: '0.35rem 0.85rem', background: PRIMARY_COLOR, transition: 'background 0.18s' }}
      onMouseOver={e => { e.currentTarget.style.background = '#d1d4cc'; e.currentTarget.style.color = BLACK; }}
      onMouseOut={e => { e.currentTarget.style.background = PRIMARY_COLOR; e.currentTarget.style.color = SECONDARY_COLOR; }}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

const Details = ({ eventDetails, eventTitle }) => { 
  return (
    <Drawer.Root> 
        <Text></Text>
        <Drawer.Trigger asChild>
         <ActionButton ariaLabel="Details">
           <p className="eventcard-action-text">{DETAILS}</p>
         </ActionButton>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="fixed" boxSize="full" />
        {/* center the drawer content in the viewport */}
        <Drawer.Positioner
          pos="fixed"
          boxSize="full"
          padding="2"
          style={{ display: FLEX, alignItems: POINTER, justifyContent: POINTER, padding: '1rem' }}
        >
          <Drawer.Content
            style={{
              width: 'min(92vw, 720px)',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 'clamp(0.5rem, 2vw, 1rem)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
            }}
          >
            <Drawer.Header style={{ position: RELATIVE, paddingLeft: '2.5rem', backgroundColor: PRIMARY_COLOR }}>
            </Drawer.Header>
            <Drawer.Body color={DRAWER_DETAILS_FONT_COLOR} backgroundColor={BACKGROUND_COLOR} style={{ padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
              <p style={{ whiteSpace: 'pre-line', fontSize: '16px', lineHeight: 1.2, padding: '0 0rem', fontWeight: "bolder" }}>
                {eventDetails}
              </p>
            </Drawer.Body>
            <Drawer.Footer bg={PRIMARY_COLOR} >
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
    </Drawer.Root>
  )
}

export default function EventCard({ event }) {
  return (
    <>
      <style>{`
        .eventcard-actions{ display:flex; align-items:center; justify-content:flex-start; gap:0.64rem; width:100%; }
        .eventcard-action-text{ font-weight:700; font-size:20px; margin:0; }
        @media (max-width: 767px){
          .eventcard-actions{ gap:calc(0.64rem * 0.9); }
          .eventcard-action-text{ font-size:calc(20px * 0.8); }
        }
      `}</style>
        <Card.Root size="md" overflow="hidden" rounded="lg" style={{ margin: '0 auto', width: MAX, maxWidth: 'clamp(260px, 86vw, 420px)', minWidth: 0, boxSizing: 'border-box', border: '2px solid #e0e4dd', borderRadius: 'clamp(0.675rem, 5.4vw, 2.7rem)' }}> 
      <div style={{ width: MAX, display: 'block' }}>
        <img
          src={event.image_url}
          alt={event.title}
          style={{
            width: MAX,
            height: AUTO,
            maxWidth: '420px',
            minWidth: 0,
            objectFit: 'contain',
            display: BLOCK
          }}
        />
      </div>
          <Card.Body gap="2" padding="4" bg="#fffbf1"  style={{ lineHeight: 2.0 }}> 
            <Card.Title
              textAlign={CENTER}
              fontSize="2xl"
              fontWeight="900"
              backgroundColor={PRIMARY_COLOR}
              padding={DEFAULT_PADDING}
              borderRadius="lg"
              color={DRAWER_DETAILS_FONT_COLOR}
              mt={-1}
              mb={1}
            >
              {event.title}
            </Card.Title>
        <Card.Description
              padding={DEFAULT_PADDING}
              borderRadius="lg" fontSize="xl" color={DRAWER_DETAILS_FONT_COLOR} pt={2}>
          {event.chef_names && Array.isArray(event.chef_names) && Array.isArray(event.chef_instagrams)
            ? event.chef_names.map((name, idx) => (
                <span
                  key={name}
                  style={{ cursor: POINTER, marginRight: idx < event.chef_names.length - 1 ? 4 : 0 }}
                  onClick={() => handleInstagram(event.chef_instagrams[idx])}
                >
                  {(event.chef_names.length === 1 || idx === 0) && (
                    <RiInstagramFill className="inline-block mr-1 mb-1"> </RiInstagramFill>
                  )}
                  <span>  {name} </span>
                </span>
              )).reduce((prev, curr, idx) => prev === null ? [curr] : [...prev, <span key={`x-${idx}`}> X </span>, curr], null)
            : ''}
          <br/>
          <SiGooglecalendar className={ACTION_SEPARATOR} />
          <span className={ACTION_CLASSNAME} onClick={() => handleCalendar(event)}>
            {formatDateRange(event.start_datetime, event.end_datetime)}
          </span>
          <br/>
          <div> 
            <SiGooglemaps className={ACTION_SEPARATOR} />
            <span
              className={ACTION_CLASSNAME}
              style={{ top: '2px' }}
              onClick={() => handleMaps(event.venue_address)}
            >
            {event.venue_address}
          </span>
           </div>
        </Card.Description>
      </Card.Body>
      <div style={{ width: '100%', height: '2px', background: PRIMARY_COLOR }} />
  <Card.Footer gap="2" style={{ padding: '1.25rem 2.5rem 1rem 0.5rem', backgroundColor: PRIMARY_COLOR}}> 
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '0.64rem', width: '100%', marginTop: '-15px', marginBottom: '-10px' }}>
        <div className="eventcard-actions">
          <ActionButton onClick={() => window.open(event.reservation_url, '_blank', 'noopener,noreferrer')} ariaLabel="Reserve">
            <p className="eventcard-action-text">{RESERVE}</p>
          </ActionButton>
          <ActionButton onClick={() => handleWhatsApp(event.english_description)} ariaLabel="Share">
            <p className="eventcard-action-text">{SHARE}</p>
          </ActionButton>
          <Details eventDetails={formatEventDescription(event)} eventTitle={event.title}/>
        </div>
    </div>
  </Card.Footer>
    </Card.Root>
    </>
  );
}