import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatEventDescription } from 'utils/formatting';
import * as Config from 'config/index.jsx';
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
      style={{ width: Config.MAX, display: Config.BLOCK, position: Config.RELATIVE, transformOrigin: 'right center' }}
    >
      <img
        src={event.poster}
        alt={event.title}
        loading={index === 0 ? 'eager' : 'lazy'}
        fetchPriority={index === 0 ? Config.FETCH_PRIORITY_HIGH : Config.FETCH_PRIORITY_LOW}
        style={{
          width: Config.MAX,
          height: 'auto',
          maxWidth: '420px',
          minWidth: 0,
          objectFit: Config.CONTAIN,
          display: Config.BLOCK,
          background: Config.FLIP_IMAGE_BACKGROUND,
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
    if (e.type === 'pointerenter' && e.pointerType === Config.MOUSE) setOverlayVisible(true);
    if (e.type === 'pointerleave' && e.pointerType === Config.MOUSE) setOverlayVisible(false);
    e.currentTarget.style.transition = `all 0.25s ${Config.EASE_IN_OUT}`;
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setShowDetails((prev) => !prev);
  };

  return (
    <div
      style={{
        width: Config.MAX,
        display: Config.BLOCK,
        position: Config.RELATIVE,
        cursor: Config.POINTER,
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
                background: Config.FLIP_IMAGE_BACKGROUND,
                borderRadius: '1rem',
                whiteSpace: 'pre-line',
                fontSize: '1rem',
                fontWeight: 900,
                color: Config.GRAY,
              }}
            >
              {formatEventDescription(event)}
            </p>
          </motion.div>
        ) : (
          <EventImage event={event} />
        )}
      </AnimatePresence>
      {VisibleOverlay && <div style={{ ...Config.OVERLAY_STYLE }} />}
    </div>
  );
}
