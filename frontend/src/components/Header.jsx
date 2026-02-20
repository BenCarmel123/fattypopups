import React from "react"
import { Button } from "@chakra-ui/react";
import Logo from './Logo.jsx';
import AdminButton from './AdminButton.jsx';
import * as Config from '../config/index.jsx';

const ABOUT_ROUTE = process.env.REACT_APP_ABOUT_ROUTE;

export function About() {
  function handleAbout() {
    window.location.href = "/" + ABOUT_ROUTE;
  }
  return (
    <div className="flex items-center">
      <Button
        variant={Config.SOLID}
        size={Config.SMALL}
        color={Config.SECONDARY_COLOR}
        px={2}
        py={2}
        borderRadius={Config.XL}
        borderBoxing='border-box'
        boxShadow={Config.SMALL}
        borderStyle={Config.SOLID}
        borderWidth='2px'
        backgroundColor={Config.TRANSPARENT}
        borderColor="#ffffff3d"
        _hover={{ transform: Config.MINIMAL_TRANSFORM }}
        transition={Config.MINIMAL_TRANSITION}
        onClick={handleAbout}
      >
        {Config.ABOUT_BUTTON_TEXT}
      </Button>
    </div>
  );
}

export default function Header( { token } ) {
  const tokenValue = token ? token() : null;

  return (
  <header className="top-0 z-50 px-6 md:px-16 py-[0.75rem] md:py-[0.75rem]" style={{ backgroundColor: Config.HEADER_BACKGROUND_COLOR, borderBottom: `0.5px solid ${Config.HEADER_BORDER_COLOR}` }} >
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