import * as Config from 'config/index.jsx';

const heroHeadingStyle = {
    margin: '0 auto',
    maxWidth: '12ch',
    fontSize: 'clamp(1.8rem, 7vw, 2.75rem)',
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: '-0.03em',
    color: '#3d4f4e',
    overflowWrap: 'break-word',
};

const heroAccentStyle = {
    whiteSpace: 'nowrap',
    background: Config.HERO_TEAL_GRADIENT,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};

const heroPillStyle = {
    display: 'inline-block',
    fontSize: 'clamp(0.72rem, 0.6rem + 0.6vw, 0.95rem)',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: Config.SECONDARY_COLOR,
    background: 'rgba(54, 131, 130, 0.10)',
    padding: '0.4rem 1.1rem',
    borderRadius: '9999px',
    marginTop: '1rem',
};

export default function InstructionHint() {
    return (
        <>
            <h1 style={heroHeadingStyle}>
                Discover TLV's{' '}
                <span style={heroAccentStyle}>pop-ups</span>
            </h1>

            <span style={heroPillStyle}>
                {Config.SUBHEADER_TEXT_2}
            </span>
        </>
    );
}
