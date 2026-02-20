import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatEventDescription } from 'utils/formatting';
import { GRAY, MAX, BLOCK, OVERLAY_STYLE, RELATIVE, POINTER, FLIP_IMAGE_BACKGROUND, EASE_IN_OUT, MOUSE, CONTAIN, FETCH_PRIORITY_HIGH, FETCH_PRIORITY_LOW } from 'config/index.jsx';
import { useEventIndex } from 'pages/home/context/EventIndexContext.js';

const detailsBackgroundImageUrl = process.env.REACT_APP_DETAILS_BACKGROUND_IMAGE_URL;

/* -------------------------- EVENT IMAGE -------------------------- */
export function EventImage({ event }) {
  const index = useEventIndex();
  return (
    <motion.div
      key="image"
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ width: MAX, display: BLOCK, position: RELATIVE, transformOrigin: 'right center' }}
    >
      <img
        src={event.poster}
        alt={event.title}
        loading={index === 0 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? FETCH_PRIORITY_HIGH : FETCH_PRIORITY_LOW}
        style={{
          width: MAX,
          height: 'auto',
          maxWidth: '420px',
          minWidth: 0,
          objectFit: CONTAIN,
          display: BLOCK,
          background: FLIP_IMAGE_BACKGROUND,
        }}
      />
    </motion.div>
  );
}

/* -------------------------- FLIP IMAGE -------------------------- */
export default function FlipImage({ event }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [VisibleOverlay, setOverlayVisible] = React.useState(false);

  const handleInteraction = (e) => {
    if (e.type === 'pointerenter' && e.pointerType === MOUSE) setOverlayVisible(true);
    if (e.type === 'pointerleave' && e.pointerType === MOUSE) setOverlayVisible(false);
    e.currentTarget.style.transition = `all 0.25s ${EASE_IN_OUT}`;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setShowDetails((prev) => !prev);
  };

  return (
    <div
      style={{
        width: MAX,
        display: BLOCK,
        position: RELATIVE,
        cursor: POINTER,
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
                background: FLIP_IMAGE_BACKGROUND,
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
