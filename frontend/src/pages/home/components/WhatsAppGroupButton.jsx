import * as Config from 'config/index.jsx';

export default function WhatsAppGroupButton() {
    return (
        <a
            href={Config.WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                backgroundColor: Config.SECONDARY_COLOR,
                color: Config.WHITE,
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                transition: Config.MINIMAL_TRANSITION,
            }}
        >
            <Config.FaWhatsapp size={18} />
            {Config.WHATSAPP_GROUP_TEXT}
        </a>
    );
}
