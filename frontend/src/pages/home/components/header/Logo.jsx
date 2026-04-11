import React from "react"
import * as Config from 'config/index.jsx';

export default function Logo() {
  return (
    <div className="flex items-center">
      <img src={Config.LOGO_URL} alt={Config.APP_NAME} className="h-42 w-40 object-contain" style={{width:'7rem'}} />
    </div>
  );
}
