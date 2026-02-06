import React from 'react';
import { Card } from '@chakra-ui/react';
import { MEDIUM, LARGE, MAX, SOLID } from '../../../../config/index.jsx';
import CardBody from './parts/CardBody.jsx';
import CardFooter from './parts/CardFooter.jsx';
import FlipImage from './parts/FlipImage.jsx';

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
        <FlipImage event={event} />
        <CardBody event={event} />
        <CardFooter event={event} />
      </Card.Root>
    </>
  );
}
