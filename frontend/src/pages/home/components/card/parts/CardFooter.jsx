import { Card, Button } from '@chakra-ui/react';
import { handleWhatsApp } from 'utils/externalLinks';
import { defaultOnMouseEnter, defaultOnMouseLeave } from 'utils/interactions';
import * as Config from 'config/index.jsx';

/* -------------------------- ACTION BUTTON -------------------------- */
function ActionButton({ children, onClick, ariaLabel, className = '', fullCover = false }) {
  const baseStyle = { color: Config.GRAY, minHeight: '2.6rem', minWidth: '2.2rem', padding: '0.45rem', transition: 'background 0.18s' };
  const coverStyle = { position: Config.ABSOLUTE, top: 0, left: 0, width: Config.MAX, height: Config.MAX, padding: 0, minHeight: 0, minWidth: 0, border: Config.NONE, zIndex: 2 };
  const combinedStyle = fullCover ? { ...coverStyle } : baseStyle;
  return (
    <Button
      variant={Config.SUBTLE}
      size={Config.XL}
      rounded={Config.XXL}
      className={`detailsDrawerButton ${className}`}
      style={combinedStyle}
      aria-label={ariaLabel}
      onClick={onClick}
      borderBottom={Config.NONE}
    >
      {children}
    </Button>
  );
}

/* -------------------------- FOOTER ACTION BUTTON -------------------------- */
const FooterOption = ({ text, onClick }) => {
  return (
    <p className="eventcard-action-text" style={{ 
      display: 'inline-flex', 
      alignItems: Config.CENTER, 
      whiteSpace: Config.NOWRAP,
    }} onMouseEnter={defaultOnMouseEnter} onMouseLeave={defaultOnMouseLeave} onClick={onClick}> 
      {text}
    </p>
  );
};

export default function CardFooter({ event }) {
  return (
    <Card.Footer style={{ padding: '1.25rem 1rem 1rem 1rem', backgroundColor: Config.FOOTER_BACKGROUND_COLOR }}>
      <div style={{ display: Config.FLEX, alignItems: Config.CENTER, justifyContent: Config.CENTER, width: Config.MAX, marginTop: '-15px', marginBottom: '-10px' }}>
        <div className="eventcard-actions" style={{ display: Config.FLEX, alignItems: Config.CENTER, justifyContent: Config.CENTER, gap: '1rem', width: Config.MAX, maxWidth: '340px', margin: '0 auto' }}>
          <ActionButton onClick={() => window.open(event.reservation_url, Config.SELF, Config.NO_OPENER)} ariaLabel={Config.RESERVE}>
            <Config.GiForkKnifeSpoon style={{ verticalAlign: Config.MIDDLE, marginRight: '-0.3rem' }} />
           <FooterOption text={Config.RESERVE} onClick={() => window.open(event.reservation_url, Config.SELF, Config.NO_OPENER)} />
          </ActionButton>
          <ActionButton onClick={() => handleWhatsApp(event.english_description)} ariaLabel="Share">
            <Config.FaWhatsapp style={{ verticalAlign: Config.MIDDLE, marginRight: '-0.3rem' }} />
            <FooterOption text={Config.SHARE} onClick={() => handleWhatsApp(event.english_description)} />
          </ActionButton>
        </div>
      </div>
    </Card.Footer>
  );
}
