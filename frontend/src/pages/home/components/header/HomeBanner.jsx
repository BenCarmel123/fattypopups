import InstructionHint from './InstructionHint.jsx';
import * as Config from 'config/index.jsx';
import * as Classes from 'config/classes.jsx';

const bannerStyle = {
    width: Config.MAX,
    maxWidth: '640px',
    margin: '1.75rem auto 2.5rem',
    padding: '0 0.5rem',
    textAlign: 'center',
    boxSizing: 'border-box',
};

export default function HomeBanner() {
    return (
        <section className={Classes.BANNER_SECTION} style={bannerStyle}>
            <InstructionHint />
        </section>
    );
}
