import { Card } from '@chakra-ui/react';
import { formatDateRange } from 'utils/formatting';
import { handleMaps, handleInstagram, handleCalendar } from 'utils/externalLinks';
import * as Config from 'config/index.jsx';
import EventAttributeSpan from './EventAttributeSpan.jsx';

const CardDivider = () => <hr style={{ borderColor: Config.GRAY, opacity: 0.15, margin: '2px 0' }} />;

// Combines venue and chefs into a consolidated list of instagram entries
function getInstagramEntries(event) {
  return [
    event.venue?.instagram_handle ? { name: event.venue.name, handle: event.venue.instagram_handle } : null,
    ...(Array.isArray(event.chefs) ? event.chefs.map(chef => ({ name: chef.name, handle: chef.instagram_handle })) : []),
  ]
    .filter(Boolean)
    .filter((entry, idx, arr) => arr.findIndex(e => e.handle === entry.handle) === idx);
}

export default function CardBody({ event }) {
  const instagramEntries = getInstagramEntries(event);
  
  return (
    <Card.Body gap="2" padding="5" bg={Config.CARD_BACKGROUND_COLOR} style={{ lineHeight: 2.0 }}>
      <Card.Title
        textAlign={Config.CENTER}
        fontSize={Config.XL}
        fontWeight={Config.BOLDER}
        color="gray.600"
        mt={-1}
        mb={1}
        borderRadius="20px"
        backgroundColor={Config.HOVER}
        borderBottom="medium solid"
        borderBottomColor={Config.VERY_SUBTLE_BORDER}
        px={2}
        py={1}
      >
        {event.title}
      </Card.Title>
      <Card.Description fontSize={Config.MEDIUM} paddingRight={4} paddingLeft={4} lineHeight={3.5}>
        {instagramEntries.map((entry, idx) => (
          <span
            key={idx}
            style={{ cursor: Config.POINTER, display: Config.BLOCK, marginLeft: idx === 0 ? 0 : "27px" }}
            onClick={() => handleInstagram(entry.handle)}
          >
            {idx === 0 && <Config.RiInstagramFill className="inline-block mr-2.5 mb-1" style={{ color: Config.GRAY }} />}
            <EventAttributeSpan attribute={entry.name} onClick={() => handleInstagram(entry.handle)} />
            <br />
          </span>
        ))}
        <CardDivider />
        <Config.SiGooglecalendar className={Config.ACTION_BUTTON_SPACING} style={{ color: Config.GRAY }} />
        <EventAttributeSpan attribute={formatDateRange(event.start_datetime, event.end_datetime)} onClick={() => handleCalendar(event)} />
        <br />
        <CardDivider />
        <span style={{ display: Config.BLOCK }}>
          <Config.SiGooglemaps className={Config.ACTION_BUTTON_SPACING} style={{ color: Config.GRAY }} />
          <EventAttributeSpan attribute={event.venue?.address} onClick={() => handleMaps(event.venue?.address)} />
        </span>
      </Card.Description>
    </Card.Body>
  );
}
