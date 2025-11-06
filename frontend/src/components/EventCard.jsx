import React from 'react';
import { Card, Text, Button, Drawer } from '@chakra-ui/react';
import { formatDateRange, handleMaps, handleWhatsApp, handleInstagram, handleCalendar, formatEventDescription } from './utils';
import { PRIMARY_COLOR, BACKGROUND_COLOR, GRAY, CARD_BACKGROUND_COLOR, FOOTER_BACKGROUND_COLOR, EVENT_TITLE_PADDING_COLOR, DRAWER_BACKGROUND_COLOR, SECONDARY_COLOR, TRANSPARENT} from './config/colors.jsx';
import { RiInstagramFill } from "react-icons/ri";
import { SiGooglemaps, SiGooglecalendar } from "react-icons/si";
import { RESERVE, DETAILS, SHARE } from './config/strings';
import { GiForkKnifeSpoon } from "react-icons/gi";
import { TbSend } from "react-icons/tb";
import { LuSquarePlus } from "react-icons/lu";


// Details drawer component
function ActionButton({ children, onClick, ariaLabel, className = '' }) {
  return (
    <Button
      variant="subtle"
      size="xl"
      rounded="2xl"
      className={`detailsDrawerButton ${className}`}
    style={{ color: GRAY, minHeight: '2.6rem', minWidth: '2.2rem', padding: '0.35rem 0.85rem', background: TRANSPARENT, transition: 'background 0.18s' }}
      onMouseOver={e => { e.currentTarget.style.background = TRANSPARENT }}
      onMouseOut={e => { e.currentTarget.style.background = TRANSPARENT;}}
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
           <LuSquarePlus style={{ verticalAlign: 'middle', marginRight: '-0.1rem' }} />
           <p className="eventcard-action-text" style={{display: 'inline-flex', alignItems: 'center', gap: '0.12rem', whiteSpace: 'nowrap'}}>{DETAILS}</p>
         </ActionButton>
        </Drawer.Trigger>
        <Drawer.Backdrop pos="fixed" boxSize="full" />
        <Drawer.Positioner
          pos="fixed"
          boxSize="full"
          padding="2"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
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
            <Drawer.Header style={{ position: 'relative', paddingLeft: '2.5rem', backgroundColor: PRIMARY_COLOR }}>
            </Drawer.Header>
            <Drawer.Body color='gray.600' backgroundColor={DRAWER_BACKGROUND_COLOR} style={{ padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
              <p style={{ whiteSpace: 'pre-line', fontSize: '16px', lineHeight: 1.2, padding: '0 0rem', fontWeight: "bolder" }}>
                {eventDetails}
              </p>
            </Drawer.Body>
            <Drawer.Footer bg={FOOTER_BACKGROUND_COLOR} >
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
        /* center the action group and distribute buttons evenly on desktop */
  .eventcard-actions{ display:flex; align-items:center; justify-content:space-between; gap:0.64rem; width:100%; max-width:420px; margin:0 auto; box-sizing: border-box; }
        .eventcard-action-text{ font-weight:700; font-size:20px; margin:0; }
        @media (max-width: 767px){
          /* on small screens keep them grouped and centered */
          .eventcard-actions{ justify-content:center; gap:calc(0.64rem * 0.9); width:auto; }
          .eventcard-action-text{ font-size:calc(20px * 0.8); }
        }
      `}</style>
        <Card.Root size="md" overflow="hidden" rounded="lg" style={{ margin: '0 auto', width: '100%', maxWidth: 'clamp(260px, 86vw, 420px)', minWidth: 0, boxSizing: 'border-box', border: '2px solid #e0e4dd', borderRadius: 'clamp(0.675rem, 5.4vw, 2.7rem)' }}> 
      {/* show the full original image (no cropping) - keep responsive width and scale height automatically */}
      <div style={{ width: '100%', display: 'block' }}>
        <img
          src={event.image_url}
          alt={event.title}
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '420px',
            minWidth: 0,
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>
          <Card.Body gap="2" padding="4" bg={CARD_BACKGROUND_COLOR} style={{ lineHeight: 2.0}}> 
            <Card.Title
              textAlign="center"
              fontSize="2xl"
              fontWeight="900"
              color="gray.600"
              mt={-1}
              mb={1}
              padding={3}
              backgroundColor={EVENT_TITLE_PADDING_COLOR}
              borderRadius="2xl"
            >
              {event.title}
            </Card.Title>
        <Card.Description fontSize="xl" color="gray.600" pt={2} paddingRight={4} paddingLeft={4} lineHeight={2.5} >
          {event.chef_names && Array.isArray(event.chef_names) && Array.isArray(event.chef_instagrams)
            ? event.chef_names.map((name, idx) => (
                <span
                  key={name}
                  style={{ cursor: 'pointer', marginRight: idx < event.chef_names.length - 1 ? 4 : 0 }}
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
          <SiGooglecalendar className="inline-block mr-2.5" />
          <span className="cursor-pointer text-[20px] relative" onClick={() => handleCalendar(event)}>
            {formatDateRange(event.start_datetime, event.end_datetime)}
          </span>
          <br/>
          <div> 
            <SiGooglemaps className="inline-block mr-2.5" />
            <span
              className="cursor-pointer text-[20px] relative"
              style={{ top: '2px' }}
              onClick={() => handleMaps(event.venue_address)}
            >
            {event.venue_address}
          </span>
           </div>
        </Card.Description>
      </Card.Body>
      <div style={{ width: '100%', height: '2px', background: PRIMARY_COLOR }} />
  <Card.Footer style={{ padding: '1.25rem 1rem 1rem 1rem', backgroundColor: FOOTER_BACKGROUND_COLOR}}> 
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '-15px', marginBottom: '-10px'}}>
  <div className="eventcard-actions" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.1rem', width: '100%', maxWidth: '340px', margin: '0 auto'}}>
          <ActionButton onClick={() => window.open(event.reservation_url, '_blank', 'noopener,noreferrer')} ariaLabel="Reserve">
            <GiForkKnifeSpoon style={{ verticalAlign: 'middle', marginRight: '-0.1rem' }} />
            <p className="eventcard-action-text" style={{display: 'inline-flex', alignItems: 'center', gap: '0.12rem', whiteSpace: 'nowrap'}}>{RESERVE}</p>
          </ActionButton>
          <ActionButton onClick={() => handleWhatsApp(event.english_description)} ariaLabel="Share">
            <TbSend style={{ verticalAlign: 'middle', marginRight: '-0.1rem' }} />
            <p className="eventcard-action-text" style={{display: 'inline-flex', alignItems: 'center', gap: '0.12rem', whiteSpace: 'nowrap'}}>{SHARE}</p>
          </ActionButton>
          <Details eventDetails={formatEventDescription(event)} eventTitle={event.title}/>
        </div>
    </div>
  </Card.Footer>
    </Card.Root>
    </>
  );
}