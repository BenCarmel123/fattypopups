import { defaultOnMouseEnter, defaultOnMouseLeave } from 'utils/interactions';
import * as Config from 'config/index.jsx';

export default function EventAttributeSpan({ attribute, onClick }) {
  return (
    <span
      style={{
        top: '2px',
        border: Config.SOLID,
        borderColor: Config.BORDER_COLOR,
        borderRadius: '12px',
        padding: Config.LINK_PADDING,
        borderWidth: '2.5px',
        cursor: Config.POINTER,
        color: Config.GRAY,
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
