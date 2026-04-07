import * as Config from 'config/index.jsx';

export default function InstructionHint() {
    return (
        <>
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
        </>
    );
}
