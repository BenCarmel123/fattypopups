import { Card } from '@chakra-ui/react';
import { handleWhatsApp } from 'utils/externalLinks';
import * as Config from 'config/index.jsx';

const FOOTER_BUTTON_STYLES = `
  .fp-footer-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    height: 2.7rem;
    padding: 0 1rem;
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease, opacity 0.16s ease;
  }
  .fp-footer-btn:active { transform: scale(0.97); }
  .fp-footer-btn--primary {
    color: ${Config.WHITE};
    border: none;
    background: ${Config.PRIMARY_BUTTON_GRADIENT};
    box-shadow: 0 6px 16px -8px ${Config.TEAL_BORDER};
  }
  .fp-footer-btn--primary:hover { box-shadow: 0 8px 20px -8px rgba(54, 131, 130, 0.7); transform: translateY(-1px); }
  .fp-footer-btn--secondary {
    color: ${Config.SECONDARY_COLOR};
    background: ${Config.TEAL_TINT};
    border: 1px solid ${Config.TEAL_BORDER_SOFT};
  }
  .fp-footer-btn--secondary:hover { background: ${Config.TEAL_TINT_HOVER}; transform: translateY(-1px); }
`;

const footerStyle = { padding: '0.85rem 1rem', background: Config.CARD_BACKGROUND_COLOR, borderTop: `2px solid ${Config.TEAL_BORDER}` };

export default function CardFooter({ event }) {
  return (
    <Card.Footer style={footerStyle}>
      <style>{FOOTER_BUTTON_STYLES}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', maxWidth: '360px', margin: '0 auto' }}>
        <button
          className="fp-footer-btn fp-footer-btn--primary"
          aria-label={Config.RESERVE}
          onClick={() => window.open(event.reservation_url, Config.BLANK, Config.NO_OPENER)}
        >
          <Config.GiForkKnifeSpoon style={{ fontSize: '1.05rem' }} />
          {Config.RESERVE}
        </button>
        <button
          className="fp-footer-btn fp-footer-btn--secondary"
          aria-label="Share"
          onClick={() => handleWhatsApp(event)}
        >
          <Config.FaWhatsapp style={{ fontSize: '1.05rem' }} />
          {Config.SHARE}
        </button>
      </div>
    </Card.Footer>
  );
}
