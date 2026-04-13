import { Card } from '@chakra-ui/react';
import { formatDateRange } from 'utils/formatting';
import { handleMaps, handleInstagram, handleCalendar } from 'utils/externalLinks';
import * as Config from 'config/index.jsx';
import EventAttributeSpan from './EventAttributeSpan.jsx';

export default function CardBody({ event }) {
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
        backgroundColor={Config.EVENT_TITLE_PADDING_COLOR}
        borderBottom="medium solid"
        borderBottomColor={Config.BORDER_COLOR}
        px={2}
        py={1}
      >
        {event.title}
      </Card.Title>
      <Card.Description fontSize={Config.MEDIUM} color="gray.600" paddingRight={4} paddingLeft={4} lineHeight={3.5}>
        {event.venue?.instagram_handle && (
          <span
            style={{ cursor: Config.POINTER, display: Config.BLOCK }}
            onClick={() => handleInstagram(event.venue.instagram_handle)}
          >
            <Config.RiInstagramFill className="inline-block mr-2.5 mb-1" />
            <EventAttributeSpan attribute={event.venue.name} onClick={() => handleInstagram(event.venue.instagram_handle)} />
            <br />
          </span>
        )}
        {event.chefs &&
          Array.isArray(event.chefs) &&
          event.chefs.length > 0 &&
          event.chefs
            .map((chef, idx) => (
             <span
                key={idx}
                style={{
                  cursor: Config.POINTER,
                  marginRight: idx < event.chefs.length - 1 ? 4 : 0,
                  display: Config.BLOCK,
                  marginLeft: idx === 0 ? 0 : "27px"
                }}
                onClick={() => handleInstagram(chef.instagram_handle)}
                >
                {(event.chefs.length === 1 || idx === 0) && 
                <p className="inline-block mr-6 mb-1" />}
                {(chef.instagram_handle != event.venue?.instagram_handle) && (
                  <>
                    <EventAttributeSpan attribute={chef.name} onClick={() => handleInstagram(chef.instagram_handle)} style={{ marginLeft: '3.5px' }} />
                    <br />
                  </>
                )}
              </span>
            ))
        }
        <Config.SiGooglecalendar className={Config.ACTION_BUTTON_SPACING} />
        <EventAttributeSpan attribute={formatDateRange(event.start_datetime, event.end_datetime)} onClick={() => handleCalendar(event)} />
        <br />
        <span style={{ display: Config.BLOCK }}>
          <Config.SiGooglemaps className={Config.ACTION_BUTTON_SPACING} />
          <EventAttributeSpan attribute={event.venue?.address} onClick={() => handleMaps(event.venue?.address)} />
        </span>
      </Card.Description>
    </Card.Body>
  );
}
