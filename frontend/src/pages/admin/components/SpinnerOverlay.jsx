import * as Classes from 'config/classes.jsx';

export default function SpinnerOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className={Classes.SPINNER_OVERLAY}>
      <svg
        className={Classes.SPINNER_SVG}
        viewBox="0 0 24 24"
      >
        <circle
          className={Classes.SPINNER_CIRCLE}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className={Classes.SPINNER_PATH}
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}
