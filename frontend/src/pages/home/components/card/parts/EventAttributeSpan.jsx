import { defaultOnMouseEnter, defaultOnMouseLeave } from 'utils/interactions';
import * as Config from 'config/index.jsx';

export default function EventAttributeSpan({ attribute, onClick }) {
  return (
    <span
      style={{
        display: 'inline-block',
        borderRadius: '14px',
        padding: '5px 14px',
        cursor: Config.POINTER,
        color: Config.SECONDARY_COLOR,
        backgroundColor: Config.TEAL_TINT,
        border: `1px solid ${Config.TEAL_BORDER_SOFT}`,
        fontWeight: 600,
        fontSize: '0.95rem',
        letterSpacing: 'normal',
        transition: 'transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease',
      }}
      onMouseEnter={defaultOnMouseEnter}
      onMouseLeave={defaultOnMouseLeave}
      onClick={onClick}
    >
      {attribute}
    </span>
  );
}
