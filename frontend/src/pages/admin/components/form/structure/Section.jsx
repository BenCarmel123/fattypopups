import React from "react";
import * as Config from 'config/index.jsx';

export default function Section({ children, title }) {
  return (
    <div
      style={{
        border: `1.5px solid ${Config.SLATE_BORDER}`,
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '1rem',
      }}
    >
      {title && (
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.1rem',
            marginBottom: '1.8rem',
            color: Config.FORM_INPUT_COLOR,
            backgroundColor: Config.SECTION_TINT,
            letterSpacing: '0.01em',
            textAlign: 'center',
            padding: '0.5rem 0.5rem',
            borderRadius: '1rem',
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
