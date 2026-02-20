import * as Config from 'config/index.jsx';

export default function InstructionText() {
    return (
        <h2 style={{
            fontSize: '1rem',
            fontWeight: '900',
            color: Config.GRAY,
            textAlign: Config.CENTER,
            margin: '0.5rem',
            width: 'fit-content',
            backgroundColor: Config.TRANSPARENT,
            padding: '15px',
            marginTop: '2rem',
            marginBottom: '2rem',
        }}>
            {Config.SUBHEADER_TEXT_1} <br/> {Config.SUBHEADER_TEXT_2}
        </h2>
    );
}
