// A file for common UI components
import styles from './common.module.css';

export function SubmitButton( {text, onClick} ) {
    return (
        <button className={styles.submitButton} onMouseOver={onButtonHover} onMouseOut={onButtonLeave} onClick={onClick}>
            {text}
        </button>
    );
}

export function onButtonHover(e) {
    // Get CSS variable values from the root element
    const rootStyles = getComputedStyle(document.documentElement);
    const hoverColor = rootStyles.getPropertyValue('--secondary-button-color').trim();
    
    e.target.style.backgroundColor = hoverColor;
    e.target.style.cursor = 'pointer';
    e.target.style.transform = 'scale(1.1)';
}

export function onButtonLeave(e) {
    e.target.style.backgroundColor = '';
    e.target.style.cursor = 'default';
    e.target.style.transform = 'scale(1)';
}

export function FormField( {fieldName}) {
    return (
        <div className={styles.formField}>
            <label className={styles.label}> {fieldName} </label>
            <input type="text" className={styles.input} />
        </div>
    );
}