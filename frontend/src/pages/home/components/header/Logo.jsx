import React from "react"
import * as Config from 'config/index.jsx';

export default function Logo() {
  function handleHome() {
    window.location.href = "/";
  }
  return (
    <div className="flex items-center">
      <img
        src={Config.LOGO_URL}
        alt={Config.APP_NAME}
        className="w-28 md:w-40 object-contain"
        style={{ cursor: 'pointer' }}
        onClick={handleHome}
      />
    </div>
  );
}
