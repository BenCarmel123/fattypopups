import * as Config from '../config/index.jsx';

export const defaultOnMouseEnter = (e) => {
    e.currentTarget.style.transition = 'transform 0.16s ease, background 0.16s ease';
    e.currentTarget.style.backgroundColor = Config.TEAL_TINT_HOVER;
    e.currentTarget.style.transform = 'translateY(-1px)';
}

export const defaultOnMouseLeave = (e) => {
    e.currentTarget.style.transition = 'transform 0.16s ease, background 0.16s ease';
    e.currentTarget.style.backgroundColor = Config.TEAL_TINT;
    e.currentTarget.style.transform = 'translateY(0)';
}
