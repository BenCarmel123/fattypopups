import * as Config from 'config/index.jsx';
import InstructionHint from './InstructionHint.jsx';
import WhatsAppGroupButton from './WhatsAppGroupButton.jsx';

export default function HomeBanner() {
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
            <InstructionHint />
            <WhatsAppGroupButton />
        </div>
    );
}
