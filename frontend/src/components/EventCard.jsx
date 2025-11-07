import React from 'react';
import { Card, Text, Button, Drawer } from '@chakra-ui/react';
import { formatDateRange, handleMaps, handleWhatsApp, handleInstagram, handleCalendar, formatEventDescription, defaultOnMouseEnter, defaultOnMouseLeave } from './utils';
import { PRIMARY_COLOR, GRAY, CARD_BACKGROUND_COLOR, FOOTER_BACKGROUND_COLOR, EVENT_TITLE_PADDING_COLOR, DRAWER_BACKGROUND_COLOR, TRANSPARENT, DRAWER_DETAILS_FONT_COLOR, HOVER, WHITE} from './config/colors.jsx';
import { RiInstagramFill } from "react-icons/ri";
import { SiGooglemaps, SiGooglecalendar } from "react-icons/si";
import { RESERVE, DETAILS, SHARE, XL, XXL, FLEX, AUTO, CENTER, FIXED, FULL, RELATIVE, ACTION_BUTTON_HOVER, MEDIUM, 
  LARGE, MAX, BLOCK, POINTER, ACTION_BUTTON_SPACING, BLANK, NO_OPENER, OVERLAY_STYLE, 
  MINIMAL_TRANSITION} from './config/strings';
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";


function ActionButton({ children, onClick, ariaLabel, className = '', fullCover = false }) {
  const baseStyle = { color: GRAY, minHeight: '2.6rem', minWidth: '2.2rem', padding: '0.45rem', background: TRANSPARENT, transition: 'background 0.18s' };
  const coverStyle = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: 0, minHeight: 0, minWidth: 0, background: TRANSPARENT, border: 'none', zIndex: 2 };
  const combinedStyle = fullCover ? { ...coverStyle } : baseStyle;
return (
  <Button
    variant="subtle"
    size={XL}
    rounded={XXL}
    className={`detailsDrawerButton ${className}`}
    style={combinedStyle}
    aria-label={ariaLabel}
    onClick={onClick}
    borderBottom="none"
  >
    {children}
  </Button>
);
}

const Details = ({ eventDetails }) => { 
  return (
    <Drawer.Root>
        <Text></Text>
        <Drawer.Trigger asChild>
          <ActionButton ariaLabel={DETAILS} fullCover className="image-cover-trigger">
            <span style={{display: 'none'}} />
          </ActionButton>
        </Drawer.Trigger>
        <Drawer.Backdrop pos={FIXED} boxSize={FULL} />
          <Drawer.Positioner
          pos={FIXED}
          boxSize={FULL}
          padding="2"
          borderBottom="none"
          style={{ display: FLEX, alignItems: CENTER, justifyContent: CENTER, padding: '1rem' }}
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
            <Drawer.Body color={DRAWER_DETAILS_FONT_COLOR} backgroundColor={DRAWER_BACKGROUND_COLOR} style={{ padding: '2rem', maxHeight: '80vh', overflowY: AUTO }}>
              <p style={{ whiteSpace: 'pre-line', fontSize: '16px', lineHeight: 1.2, padding: '0 0rem', fontWeight: "bolder" }}>
                {eventDetails}
              </p>
            </Drawer.Body>
            <Drawer.Footer bg={FOOTER_BACKGROUND_COLOR} >
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
    </Drawer.Root>
  );
}

export function EventImage({ event }) {
  return (
    <div style={{ width: MAX, display: BLOCK, position: RELATIVE }}>
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
        <Details eventDetails={formatEventDescription(event)} eventTitle={event.title}/>
      </div>
  );
}

export function EventImageContainer({ event }) {
const [Visible, setOverlayVisible] = React.useState(false);
    const handleInteraction = (e) => {
    if (e.type === 'pointerenter' && e.pointerType === 'mouse') setOverlayVisible(true);
    if (e.type === 'pointerleave' && e.pointerType === 'mouse') setOverlayVisible(false);
    if ((e.type === 'click' && e.pointerType !== 'mouse') || (e.type === 'touchend'))  {
      setOverlayVisible(!Visible);
      setTimeout(() => setOverlayVisible(false), 1500);
    }
    e.currentTarget.style.transition = MINIMAL_TRANSITION;
  };
  return (
    <div style={{ width: MAX, display: BLOCK, position: RELATIVE }}
      onPointerEnter={handleInteraction}
      onPointerLeave={handleInteraction}
      onClick={handleInteraction}>
     <EventImage event={event} />
      {Visible && (
        <div style={OVERLAY_STYLE}>
        </div>
      )}
    </div>
  );
}

export function CardFooter({ event }) {
  return (
    <Card.Footer style={{ padding: '1.25rem 1rem 1rem 1rem', backgroundColor: FOOTER_BACKGROUND_COLOR}}>
      <div style={{ display: FLEX, alignItems: CENTER, justifyContent: CENTER, width: MAX, marginTop: '-15px', marginBottom: '-10px'}}>
        <div className="eventcard-actions" style={{display: FLEX, alignItems: CENTER, justifyContent: CENTER, gap: '2srem', width: MAX, maxWidth: '340px', margin: '0 auto'}}>
          <ActionButton onClick={() => window.open(event.reservation_url, BLANK, NO_OPENER)} ariaLabel={RESERVE}>
            <GiForkKnifeSpoon style={{ verticalAlign: 'middle', marginRight: '-0.3rem' }} />
            <p className="eventcard-action-text" style={{display: 'inline-flex', alignItems: CENTER, whiteSpace: 'nowrap'}} onMouseEnter={defaultOnMouseEnter} onMouseLeave={defaultOnMouseLeave}>{RESERVE}</p>
          </ActionButton>
          <ActionButton onClick={() => handleWhatsApp(event.english_description)} ariaLabel="Share">
            <FaWhatsapp style={{ verticalAlign: 'middle', marginRight: '-0.3rem' }} />
            <p className="eventcard-action-text" style={{display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap'}} onMouseEnter={defaultOnMouseEnter} onMouseLeave={defaultOnMouseLeave}>{SHARE}</p>
          </ActionButton>
        </div>
    </div>
    </Card.Footer>
  );
}

export function CardTitle({ event }) {
   return(
     <Card.Title
       textAlign={CENTER}
       fontSize={XXL}
       fontWeight="500"
       color={DRAWER_DETAILS_FONT_COLOR}
       mt={-1}
              mb={1}
              padding={3}
              backgroundColor={EVENT_TITLE_PADDING_COLOR}
              borderRadius={XXL}
            >
              {event.title}
            </Card.Title>
    );
}

export function CardBody({ event }) {
  return ( <Card.Body gap="2" padding="5" bg={CARD_BACKGROUND_COLOR} style={{ lineHeight: 2.0 }}>
        <CardTitle event={event} />
        <Card.Description fontSize={XL} color={DRAWER_DETAILS_FONT_COLOR} paddingRight={4} paddingLeft={4} lineHeight={2.5} >
          {event.chef_names && Array.isArray(event.chef_names) && Array.isArray(event.chef_instagrams)
            ? event.chef_names.map((name, idx) => (
                <span
                  key={name}
                  style={{ cursor: POINTER, marginRight: idx < event.chef_names.length - 1 ? 4 : 0 }}
                  onClick={() => handleInstagram(event.chef_instagrams[idx])}>
                  {(event.chef_names.length === 1 || idx === 0) && (
                    <RiInstagramFill className="inline-block mr-1 mb-1"> </RiInstagramFill>
                  )}
                  <span onMouseEnter={defaultOnMouseEnter} onMouseLeave={defaultOnMouseLeave}>  {name} </span>
                </span>
              )).reduce((prev, curr, idx) => prev === null ? [curr] : [...prev, <span key={`x-${idx}`}> X </span>, curr], null)
            : ''}
          <br/>
          <SiGooglecalendar className={ACTION_BUTTON_SPACING} />
          <span className={ACTION_BUTTON_HOVER} onClick={() => handleCalendar(event)} onMouseEnter={defaultOnMouseEnter} onMouseLeave={defaultOnMouseLeave}>
            {formatDateRange(event.start_datetime, event.end_datetime)}
          </span>
          <br/>
          <div> 
            <SiGooglemaps className={ACTION_BUTTON_SPACING} />
            <span
              className={ACTION_BUTTON_HOVER}
              style={{ top: '2px' }}
              onClick={() => handleMaps(event.venue_address)}
              onMouseEnter={defaultOnMouseEnter}
              onMouseLeave={defaultOnMouseLeave}
            >
            {event.venue_address}
          </span>
           </div>
        </Card.Description>
      </Card.Body> );
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
        <Card.Root size={MEDIUM} overflow="hidden" rounded={LARGE} style={{ margin: '0 auto', width: MAX, maxWidth: 'clamp(260px, 86vw, 420px)', minWidth: 0, boxSizing: 'border-box', border: '2px solid #e0e4dd', borderRadius: 'clamp(0.675rem, 5.4vw, 2.7rem)' }}>
        <EventImageContainer event={event} />
        <CardBody event={event} />
      <div style={{ width: MAX, height: '2px', background: PRIMARY_COLOR }} />
      <CardFooter event={event} />
      </Card.Root>
    </>
  );
}

