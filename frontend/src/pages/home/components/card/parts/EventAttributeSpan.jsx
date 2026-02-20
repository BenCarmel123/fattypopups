import { defaultOnMouseEnter, defaultOnMouseLeave } from 'utils/interactions';
import { POINTER, LINK_PADDING, BORDER_COLOR, SOLID, GRAY } from 'config/index.jsx';

export default function EventAttributeSpan({ attribute, onClick }) {
  return (
    <span
      style={{
        top: '2px',
        border: SOLID,
        borderColor: BORDER_COLOR,
        borderRadius: '12px',
        padding: LINK_PADDING,
        borderWidth: '2.5px',
        cursor: POINTER,
        color: GRAY,
        letterSpacing: '1px',
      }}
      onMouseEnter={defaultOnMouseEnter}
      onMouseLeave={defaultOnMouseLeave}
      onClick={onClick}
    >
      {attribute}
    </span>
  );
}
