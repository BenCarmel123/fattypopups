import { ChevronLeft, ChevronRight } from 'lucide-react';

import styles from '../../styles/Home.module.css';

export default function RenderArrow ( {direction, nextEvent, events, current} ) {
  const ChevronIcon = direction === 'left' ? ChevronLeft : ChevronRight;
  return (
    <ChevronIcon
      className={styles.carouselArrow}
      variant="subtle"
      size="lg"
      color="blue"
      style={direction === 'left' ? { left: '-4.5rem' } : { right: '-4.5rem' }}
      _hover={{ background: 'blue.400', color: 'white' }}
      _active={{ background: 'blue.600', color: 'white' }}
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      onClick={() => {
        if (!events.length) return;
        nextEvent(() => {
          const len = events.length;
          return direction === 'left'
            ? (current - 1 + len) % len
            : (current + 1) % len;
        });
      }}
    />
  );
}
