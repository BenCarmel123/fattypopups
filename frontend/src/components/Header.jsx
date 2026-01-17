import React from "react"
import { Button } from "@chakra-ui/react";
import { 
  HEADER_BACKGROUND_COLOR, 
  HEADER_BORDER_COLOR, 
  SECONDARY_COLOR, 
  TRANSPARENT,
  APP_NAME, 
  ABOUT_BUTTON_TEXT, 
  SOLID, 
  SMALL, 
  XL, 
  MINIMAL_TRANSFORM, 
  MINIMAL_TRANSITION 
} from '../config/index.jsx';

const LOGO_URL = process.env.REACT_APP_LOGO;
const ABOUT_ROUTE = process.env.REACT_APP_ABOUT_ROUTE;

export function About() {
  function handleAbout() {
    window.location.href = "/" + ABOUT_ROUTE;
  }
  return (
    <div className="flex items-center">
      <Button
        variant={SOLID}
        size={SMALL}
        color={SECONDARY_COLOR}
        px={2}
        py={2}
        borderRadius={XL}
        borderBoxing='border-box'
        boxShadow={SMALL}
        borderStyle="solid"
        borderWidth='2px'
        backgroundColor={TRANSPARENT}
        borderColor="#ffffff3d"
        _hover={{ transform: MINIMAL_TRANSFORM }}
        transition={MINIMAL_TRANSITION}
        onClick={handleAbout}
      >
        {ABOUT_BUTTON_TEXT}
      </Button>
    </div>
  );
}

export default function Header() {
  return (
  <header className="top-0 z-50 px-6 md:px-16 py-[0.75rem] md:py-[0.75rem]" style={{ backgroundColor: HEADER_BACKGROUND_COLOR, borderBottom: `0.5px solid ${HEADER_BORDER_COLOR}` }} >
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <div className="flex items-center">
          {LOGO_URL ? (
            <a href="/" aria-label={APP_NAME} className="flex items-center">
              <img src={LOGO_URL} alt={APP_NAME} className="h-42 w-40 object-contain" style={{width:'7rem'}} />
            </a>
          ) : (
            <a href="/" className="text-lg font-bold" aria-label={APP_NAME}>{APP_NAME}</a>
          )}
        </div>

        <div>
          <About />
        </div>
      </div>
    </header>
  );
}