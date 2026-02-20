import React from "react"
import { Button } from "@chakra-ui/react";
import Logo from './Logo.jsx';
import AdminButton from './AdminButton.jsx';
import {
  HEADER_BACKGROUND_COLOR,
  HEADER_BORDER_COLOR,
  SECONDARY_COLOR,
  TRANSPARENT,
  ABOUT_BUTTON_TEXT,
  SOLID,
  SMALL,
  XL,
  MINIMAL_TRANSFORM,
  MINIMAL_TRANSITION
} from '../config/index.jsx';

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
        borderStyle={SOLID}
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

export default function Header( { token } ) {
  const tokenValue = token ? token() : null;

  return (
  <header className="top-0 z-50 px-6 md:px-16 py-[0.75rem] md:py-[0.75rem]" style={{ backgroundColor: HEADER_BACKGROUND_COLOR, borderBottom: `0.5px solid ${HEADER_BORDER_COLOR}` }} >
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <Logo />
        <div className="flex items-center gap-4">
          {tokenValue && <AdminButton />}
          <About />
        </div>
      </div>
    </header>
  );
}