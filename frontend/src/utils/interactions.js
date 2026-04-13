import * as Config from '../config/index.jsx';

export const defaultOnMouseEnter = (e) => {
    e.currentTarget.style.padding = '0.4rem 0.8rem';
    e.currentTarget.style.borderRadius = '1rem';
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transform = Config.MINIMAL_TRANSFORM;
    e.currentTarget.style.transition = Config.MINIMAL_TRANSITION;
}

export const defaultOnMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = Config.HOVER;
    e.currentTarget.style.color = Config.GRAY;
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.transition = Config.MINIMAL_TRANSITION;
    e.currentTarget.style.padding = Config.LINK_PADDING;
    e.currentTarget.style.borderRadius = '12px';
}
