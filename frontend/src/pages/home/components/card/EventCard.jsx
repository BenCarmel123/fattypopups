import { Card } from '@chakra-ui/react';
import * as Config from 'config/index.jsx';
import CardBody from './parts/CardBody.jsx';
import CardFooter from './parts/CardFooter.jsx';
import FlipImage from './parts/FlipImage.jsx';

/* -------------------------- EVENT CARD -------------------------- */
const cardRootStyle = {
  margin: '0 auto',
  width: Config.MAX,
  maxWidth: 'clamp(260px, 86vw, 420px)',
  minWidth: 0,
  boxSizing: 'border-box',
  borderStyle: Config.SOLID,
  borderColor: Config.TEAL_BORDER,
  borderRadius: '40px',
  borderWidth: '2.5px',
  boxShadow: Config.TEAL_SHADOW_CARD,
  fontWeight: Config.BOLDER,
};

export default function EventCard({ event }) {
  return (
    <Card.Root size={Config.MEDIUM} overflow="hidden" rounded={Config.LARGE} style={cardRootStyle}>
      <FlipImage event={event} />
      <CardBody event={event} />
      <CardFooter event={event} />
    </Card.Root>
  );
}
