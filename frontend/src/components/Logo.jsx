import React from "react"
import * as Config from '../config/index.jsx';

const LOGO_URL = process.env.REACT_APP_LOGO;

export default function Logo() {
  return (
    <div className="flex items-center">
      {LOGO_URL ? (
        <img src={LOGO_URL} alt={Config.APP_NAME} className="h-42 w-40 object-contain" style={{width:'7rem'}} />
      ) : (
        <div className="text-lg font-bold" aria-label={Config.APP_NAME}>{Config.APP_NAME}</div>
      )}
    </div>
  );
}
