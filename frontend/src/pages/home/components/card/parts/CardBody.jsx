import { Card } from '@chakra-ui/react';
import { formatDateRange } from 'utils/formatting';
import { handleMaps, handleInstagram, handleCalendar } from 'utils/externalLinks';
import * as Config from 'config/index.jsx';
import EventAttributeSpan from './EventAttributeSpan.jsx';

const dividerStyle = { border: 'none', borderTop: `1px solid ${Config.SUBTLE_BORDER}`, margin: '7px 0' };
const CardDivider = () => <hr style={dividerStyle} />;

const cardBodyStyle = { lineHeight: 1.5, background: Config.CARD_SURFACE_GRADIENT };
const cardDescriptionStyle = { background: Config.TRANSPARENT };
const rowStyle = { display: 'flex', alignItems: 'flex-start', gap: '10px' };
const iconStyle = { color: Config.GRAY, flexShrink: 0, marginTop: '7px', fontSize: '1.25rem' };
const pillWrapStyle = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', minWidth: 0 };

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
    <Card.Body gap="1" padding="4" style={cardBodyStyle}>
      <Card.Description fontSize={Config.MEDIUM} paddingRight={2} paddingLeft={2} lineHeight={1.8} style={cardDescriptionStyle}>
        <div style={rowStyle}>
          <Config.RiInstagramFill style={iconStyle} />
          <span style={pillWrapStyle}>
            {instagramEntries.map((entry, idx) => (
              <EventAttributeSpan key={idx} attribute={entry.name} onClick={() => handleInstagram(entry.handle)} />
            ))}
          </span>
        </div>
        <CardDivider />
        <div style={rowStyle}>
          <Config.SiGooglecalendar style={iconStyle} />
          <span style={pillWrapStyle}>
            <EventAttributeSpan attribute={formatDateRange(event.start_datetime, event.end_datetime)} onClick={() => handleCalendar(event)} />
          </span>
        </div>
        <CardDivider />
        <div style={rowStyle}>
          <Config.SiGooglemaps style={iconStyle} />
          <span style={pillWrapStyle}>
            <EventAttributeSpan attribute={event.venue?.address} onClick={() => handleMaps(event.venue?.address)} />
          </span>
        </div>
      </Card.Description>
    </Card.Body>
  );
}
