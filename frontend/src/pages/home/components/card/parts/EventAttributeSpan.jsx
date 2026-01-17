import { defaultOnMouseEnter, defaultOnMouseLeave } from '../../../../utils/interactions';
import { POINTER, LINK_PADDING } from '../../../../config/index.jsx';

export default function EventAttributeSpan({ attribute, onClick }) {
  return (
    <span
      style={{
        top: '2px',
        border: 'solid',
        borderColor: '#cde6e5',
        borderRadius: '12px',
        padding: LINK_PADDING,
        borderWidth: '2.5px',
        cursor: POINTER,
        color: '#51515b',
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
