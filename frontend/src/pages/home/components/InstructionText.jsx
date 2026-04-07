import * as Config from 'config/index.jsx';

export default function InstructionText() {
    return (
        <div style={{
            width: '100%',
            maxWidth: 'clamp(260px, 86vw, 420px)',
            margin: '1.5rem auto',
            padding: '1.2rem 1.5rem',
            backgroundColor: Config.INSTRUCTION_BACKGROUND_COLOR,
            border: `1.5px solid ${Config.BORDER_COLOR}`,
            borderRadius: '24px',
            textAlign: 'center',
            boxSizing: 'border-box',
        }}>
            <h2 style={{
                margin: 0,
                fontSize: '1.15rem',
                fontWeight: 900,
                color: Config.GRAY,
            }}>
                {Config.SUBHEADER_TEXT_1}
            </h2>

            <p style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                margin: '0.5rem 0 0.9rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: Config.GRAY,
            }}>
                {Config.SUBHEADER_TEXT_2}
                <Config.LuPointer size={18} />
            </p>

            <div>
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
            </div>
        </div>
    );
}
