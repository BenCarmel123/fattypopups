import React from "react";

export default function Section({ children, title }) {
  return (
    <div
      style={{
        border: '1.5px solid #e5e7eb',
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
            marginBottom: '0.7rem',
            color: '#6b7280',
            letterSpacing: '0.01em',
            textAlign: 'center',
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
