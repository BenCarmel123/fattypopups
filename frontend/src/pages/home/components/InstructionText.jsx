import { SUBHEADER_TEXT_1, SUBHEADER_TEXT_2 } from '../../../config/index.jsx';

export default function InstructionText() {
    return (
        <h2 style={{
            fontSize: '1rem',
            fontWeight: '900',
            color: '#51515b',
            textAlign: 'center',
            margin: '0.5rem',
            width: 'fit-content', 
            backgroundColor: 'transparent',
            padding: '15px',
            marginTop: '2rem',
            marginBottom: '2rem',
        }}>
            {SUBHEADER_TEXT_1} <br/> {SUBHEADER_TEXT_2}
        </h2>
    );
}
