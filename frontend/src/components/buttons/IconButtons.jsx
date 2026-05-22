import * as Config from 'config/index.jsx';
import { FaTrash, FaRotateRight, FaPen } from 'config/index.jsx';

const iconStyle = (isHovered, hoverColor) => ({
  cursor: Config.POINTER,
  color: isHovered ? hoverColor : 'gray',
  transition: 'color 0.2s',
});

export const DeleteButton = ({ id, hoveredIcon, setHoveredIcon, onClick }) => (
  <FaTrash
    style={iconStyle(hoveredIcon === `delete-${id}`, Config.DANGER_HOVER_COLOR)}
    onMouseEnter={() => setHoveredIcon(`delete-${id}`)}
    onMouseLeave={() => setHoveredIcon(null)}
    onClick={onClick}
  />
);

export const EditButton = ({ id, hoveredIcon, setHoveredIcon, onClick }) => (
  <FaPen
    style={iconStyle(hoveredIcon === `edit-${id}`, Config.ADMIN_PANEL_COLOR)}
    onMouseEnter={() => setHoveredIcon(`edit-${id}`)}
    onMouseLeave={() => setHoveredIcon(null)}
    onClick={onClick}
  />
);

export const RetryButton = ({ id, hoveredIcon, setHoveredIcon, onClick }) => (
  <FaRotateRight
    style={iconStyle(hoveredIcon === `retry-${id}`, Config.ADMIN_PANEL_COLOR)}
    onMouseEnter={() => setHoveredIcon(`retry-${id}`)}
    onMouseLeave={() => setHoveredIcon(null)}
    onClick={onClick}
  />
);
