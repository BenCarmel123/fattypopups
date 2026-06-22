import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatEventDescription } from 'utils/formatting';
import * as Config from 'config/index.jsx';
import { useEventIndex } from 'pages/home/context/EventIndexContext.js';


function EventImage({ event, onMeasure }) {
  const index = useEventIndex();
  const imgRef = React.useRef(null);
  const [src, setSrc] = React.useState(index === 0 ? event.poster : null);

  React.useEffect(() => {
    if (index === 0) return;
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSrc(event.poster);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(img);
    return () => observer.disconnect();
  }, [index, event.poster]);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img || !onMeasure) return;

    const measure = () => onMeasure(img.clientHeight);
    if (img.complete) measure();

    const onLoad = () => measure();
    img.addEventListener('load', onLoad);

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(img);
    }

    const onResize = () => measure();
    window.addEventListener('resize', onResize);

    return () => {
      img.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [onMeasure]);

  return (
    <motion.div
      key="image"
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      exit={{ rotateY: -90, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{ width: Config.MAX, display: Config.BLOCK, position: Config.RELATIVE, transformOrigin: 'right center' }}
    >
      <img
        ref={imgRef}
        src={src ?? ''}
        onError={(e) => { e.currentTarget.src = Config.LOGO_URL; }}
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
          background: '#fffaf5',
          borderBottom: `3px solid ${Config.TEAL_BORDER}`,
        }}
      />
    </motion.div>
  );
}

export default function FlipImage({ event }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [VisibleOverlay, setOverlayVisible] = React.useState(false);
  const [imageHeight, setImageHeight] = React.useState(null);

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
        backgroundImage: `url('${Config.BACKGROUND_IMAGE_URL}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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
            transition={{ duration: 0.23, ease: [0.4, 0, 0.2, 1] }}
            style={{
              padding: '1.8rem 1.5rem',
              textAlign: 'center',
              lineHeight: 1.55,
              transformOrigin: 'left center',
              minHeight: imageHeight ? `${imageHeight}px` : '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                padding: '1rem',
                background: Config.CARD_SURFACE_GRADIENT,
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
          <EventImage event={event} onMeasure={setImageHeight} />
        )}
      </AnimatePresence>
      {VisibleOverlay && <div style={{ ...Config.OVERLAY_STYLE }} />}
    </div>
  );
}
