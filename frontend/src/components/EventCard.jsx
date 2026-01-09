import React from 'react';
import { Card, Button } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  formatDateRange,
  handleMaps,
  handleWhatsApp,
  handleInstagram,
  handleCalendar,
  formatEventDescription,
  defaultOnMouseEnter,
  defaultOnMouseLeave,
} from './utils';
import {
  GRAY,
  CARD_BACKGROUND_COLOR,
  FOOTER_BACKGROUND_COLOR,
  EVENT_TITLE_PADDING_COLOR,
  DRAWER_DETAILS_FONT_COLOR,
  BORDER_COLOR,
} from '../config/colors.jsx';
import {
  RESERVE,
  SHARE,
  XL,
  XXL,
  FLEX,
  CENTER,
  MEDIUM,
  LARGE,
  MAX,
  BLOCK,
  POINTER,
  ACTION_BUTTON_SPACING,
  SELF,
  NO_OPENER,
  OVERLAY_STYLE,
  SUBTLE,
  SOLID,
  NONE, 
  LINK_PADDING
} from '../config/strings';
import { RiInstagramFill } from 'react-icons/ri';
import { SiGooglemaps, SiGooglecalendar } from 'react-icons/si';
import { GiForkKnifeSpoon } from 'react-icons/gi';
import { FaWhatsapp } from 'react-icons/fa';

const detailsBackgroundImageUrl = process.env.REACT_APP_DETAILS_BACKGROUND_IMAGE_URL;

/* -------------------------- ACTION BUTTON -------------------------- */
function ActionButton({ children, onClick, ariaLabel, className = '', fullCover = false }) {
  const baseStyle = { color: GRAY, minHeight: '2.6rem', minWidth: '2.2rem', padding: '0.45rem', transition: 'background 0.18s' };
  const coverStyle = { position: 'absolute', top: 0, left: 0, width: MAX, height: MAX, padding: 0, minHeight: 0, minWidth: 0, border: NONE, zIndex: 2 };
  const combinedStyle = fullCover ? { ...coverStyle } : baseStyle;
  return (
    <Button
      variant={SUBTLE}
      size={XL}
      rounded={XXL}
      className={`detailsDrawerButton ${className}`}
      style={combinedStyle}
      aria-label={ariaLabel}
      onClick={onClick}
      borderBottom={NONE}
    >
      {children}
    </Button>
  );
}

/* -------------------------- EVENT IMAGE -------------------------- */
export function EventImage({ event }) {
  return (
    <motion.div
      key="image"
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ width: MAX, display: BLOCK, position: 'relative', transformOrigin: 'right center' }}
    >
      <img
        src={event.poster}
        alt={event.title}
        style={{
          width: MAX,
          height: 'auto',
          maxWidth: '420px',
          minWidth: 0,
          objectFit: 'contain',
          display: BLOCK,
          background: '#fffaf5',
        }}
      />
    </motion.div>
  );
}

/* -------------------------- IMAGE CONTAINER -------------------------- */
export function EventImageContainer({ event }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [VisibleOverlay, setOverlayVisible] = React.useState(false);

  const handleInteraction = (e) => {
    if (e.type === 'pointerenter' && e.pointerType === 'mouse') setOverlayVisible(true);
    if (e.type === 'pointerleave' && e.pointerType === 'mouse') setOverlayVisible(false);
    e.currentTarget.style.transition = 'all 0.25s ease-in-out';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setShowDetails((prev) => !prev);
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'block',
        position: 'relative',
        cursor: 'pointer',
        perspective: '1200px',
        backgroundImage: `url('${detailsBackgroundImageUrl}')`
      }}
      onPointerEnter={handleInteraction}
      onPointerLeave={handleInteraction}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait">
        {showDetails ? (
          <motion.div
            key="details"
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{
              padding: '1.8rem 1.5rem',
              textAlign: 'center',
              lineHeight: 1.55,
              transformOrigin: 'left center',
              minHeight: '320px',
            }}
          >
            <p
              style={{
                padding: '1rem',
                background: '#fffaf5',
                borderRadius: '1rem',
                whiteSpace: 'pre-line',
                fontSize: '1rem',
                fontWeight: 900,
                color: GRAY,
              }}
            >
              {formatEventDescription(event)}
            </p>
          </motion.div>
        ) : (
          <EventImage event={event} />
        )}
      </AnimatePresence>
      {VisibleOverlay && <div style={{ ...OVERLAY_STYLE }} />}
    </div>
  );
}

export function EventAttributeSpan({ attribute, onClick }) {
  return (
    <span
      style={{
        top: '2px',
        border: 'solid',
        borderColor: '#cde6e5',
        borderRadius: '12px',
        padding: LINK_PADDING,
        borderWidth: '2.5px',
        cursor: POINTER,
        color: '#51515b',
        letterSpacing: '1px',
      }}
      onMouseEnter={defaultOnMouseEnter}
      onMouseLeave={defaultOnMouseLeave}
      onClick={onClick}
    >
      {attribute}
    </span>
  );
}

/* -------------------------- CARD BODY -------------------------- */
export function CardBody({ event }) {
  return (
    <Card.Body gap="2" padding="5" bg={CARD_BACKGROUND_COLOR} style={{ lineHeight: 2.0 }}>
  <Card.Title
  textAlign={CENTER}
  fontSize={XL}
  fontWeight="bolder"
  color={DRAWER_DETAILS_FONT_COLOR}
  mt={-1}
  mb={1}
  borderRadius="20px"
  backgroundColor={EVENT_TITLE_PADDING_COLOR}
  borderBottom="medium solid"
  borderBottomColor={BORDER_COLOR}
  px={2}
  py={1}
>
  {event.title}
</Card.Title>
      <Card.Description fontSize={MEDIUM} color={DRAWER_DETAILS_FONT_COLOR} paddingRight={4} paddingLeft={4} lineHeight={3.5}>
        {event.chef_names &&
          Array.isArray(event.chef_names) &&
          Array.isArray(event.chef_instagrams) &&
          event.chef_names
            .map((name, idx) => (
             <span
                key={name}
                style={{
                  cursor: POINTER,
                  marginRight: idx < event.chef_names.length - 1 ? 4 : 0,
                  display: "block",
                  marginLeft: idx === 0 ? 0 : "27px"  
                }}
                onClick={() => handleInstagram(event.chef_instagrams[idx])}
                >
                {(event.chef_names.length === 1 || idx === 0) && <RiInstagramFill className="inline-block mr-2.5 mb-1" />}
                <EventAttributeSpan attribute={name} onClick={() => handleInstagram(event.chef_instagrams[idx])} style={{ marginLeft: '3.5px' }} />
                <br></br>
              </span>
            ))
        }
        <SiGooglecalendar className={ACTION_BUTTON_SPACING} />
        <EventAttributeSpan attribute={formatDateRange(event.start_datetime, event.end_datetime)} onClick={() => handleCalendar(event)} />
        <br />
        <div>
          <SiGooglemaps className={ACTION_BUTTON_SPACING} />
          <EventAttributeSpan attribute={event.venue_address} onClick={() => handleMaps(event.venue_address)} />
        </div>
      </Card.Description>
    </Card.Body>
  );
}

/* -------------------------- FOOTER ACTION BUTTON -------------------------- */
export const FooterOption = ({ text, onClick }) => {
  return (
    <p className="eventcard-action-text" style={{ 
    display: 'inline-flex', 
    alignItems: CENTER, 
    whiteSpace: 'nowrap',
  }} onMouseEnter={defaultOnMouseEnter} onMouseLeave={defaultOnMouseLeave} onClick={onClick}> 
      {text}
    </p>
  );
};


/* -------------------------- CARD FOOTER -------------------------- */
export function CardFooter({ event }) {
  return (
    <Card.Footer style={{ padding: '1.25rem 1rem 1rem 1rem', backgroundColor: FOOTER_BACKGROUND_COLOR }}>
      <div style={{ display: FLEX, alignItems: CENTER, justifyContent: CENTER, width: MAX, marginTop: '-15px', marginBottom: '-10px' }}>
        <div className="eventcard-actions" style={{ display: FLEX, alignItems: CENTER, justifyContent: CENTER, gap: '1rem', width: MAX, maxWidth: '340px', margin: '0 auto' }}>
          <ActionButton onClick={() => window.open(event.reservation_url, SELF, NO_OPENER)} ariaLabel={RESERVE}>
            <GiForkKnifeSpoon style={{ verticalAlign: 'middle', marginRight: '-0.3rem' }} />
           <FooterOption text={RESERVE} onClick={() => window.open(event.reservation_url, SELF, NO_OPENER)} />
          </ActionButton>
          <ActionButton onClick={() => handleWhatsApp(event.english_description)} ariaLabel="Share">
            <FaWhatsapp style={{ verticalAlign: 'middle', marginRight: '-0.3rem' }} />
            <FooterOption text={SHARE} onClick={() => handleWhatsApp(event.english_description)} />
          </ActionButton>
        </div>
      </div>
    </Card.Footer>
  );
}

/* -------------------------- EVENT CARD -------------------------- */
export default function EventCard({ event }) {
  return (
    <>
      <style>{`
        .eventcard-actions{ display:flex; align-items:center; justify-content:space-between; gap:0.64rem; width:100%; max-width:420px; margin:0 auto; box-sizing: border-box; }
        .eventcard-action-text{ font-weight:700; font-size:20px; margin:0; }
        @media (max-width: 767px){
          .eventcard-actions{ justify-content:center; gap:calc(0.64rem * 0.9); width:auto; }
          .eventcard-action-text{ font-size:calc(20px * 0.8); }
        }
      `}</style>
        <Card.Root
        size={MEDIUM}
        overflow="hidden"
        rounded={LARGE}
        style={{
          margin: '0 auto',
          width: MAX,
          maxWidth: 'clamp(260px, 86vw, 420px)',
          minWidth: 0,
          boxSizing: 'border-box',
          borderStyle: SOLID,
          borderColor: '#cde6e5',
          borderRadius: '50px',
          borderWidth: '1.5px',
          fontWeight: 'bolder'
        }}
      >
        <EventImageContainer event={event} />
        <CardBody event={event} />
        <CardFooter event={event} />
      </Card.Root>
    </>
  );
}
