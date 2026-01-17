import { HOVER, GRAY } from '../config/colors.jsx';
import { MINIMAL_TRANSITION, MINIMAL_TRANSFORM } from '../config/strings.jsx';

export const defaultOnMouseEnter = (e) => {
    e.currentTarget.style.padding = '0.4rem 0.8rem';
    e.currentTarget.style.borderRadius = '1rem';
    e.currentTarget.style.backgroundColor = HOVER;
    e.currentTarget.style.transform = MINIMAL_TRANSFORM;
    e.currentTarget.style.transition = MINIMAL_TRANSITION;
}

export const defaultOnMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.color = GRAY;
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.transition = MINIMAL_TRANSITION;
    e.currentTarget.style.padding = '2px 5px';
}
