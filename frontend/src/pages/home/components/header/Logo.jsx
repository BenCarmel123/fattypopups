import React from "react"
import * as Config from 'config/index.jsx';
import * as Classes from 'config/classes.jsx';

export default function Logo() {
  function handleHome() {
    window.location.href = Config.ROUTE_HOME;
  }
  return (
    <div className={Classes.LOGO_WRAPPER}>
      <img
        src={Config.LOGO_URL}
        alt={Config.APP_NAME}
        className={Classes.LOGO_IMG}
        style={{ cursor: Config.POINTER }}
        onClick={handleHome}
      />
    </div>
  );
}
