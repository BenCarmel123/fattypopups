import InstructionHint from './InstructionHint.jsx';

const bannerStyle = {
    width: '100%',
    maxWidth: '640px',
    margin: '1.75rem auto 2.5rem',
    padding: '0 0.5rem',
    textAlign: 'center',
    boxSizing: 'border-box',
};

export default function HomeBanner() {
    return (
        <section className="fp-rise" style={bannerStyle}>
            <InstructionHint />
        </section>
    );
}
