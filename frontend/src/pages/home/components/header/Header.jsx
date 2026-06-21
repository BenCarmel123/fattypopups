import React from "react"
import { Button } from "@chakra-ui/react";
import Logo from './Logo.jsx';
import AdminButton from '../../../../components/buttons/AdminButton.jsx';
import WhatsAppGroupButton from './WhatsAppGroupButton.jsx';
import * as Config from 'config/index.jsx';

function About() {
  function handleAbout() {
    window.location.href = "/" + Config.ABOUT_ROUTE;
  }
  return (
      <div className="flex items-center">
      <Button
          variant={Config.SOLID}
          size={Config.SMALL}
          fontSize={["sm", "md"]}
          color={Config.SECONDARY_COLOR}
          px={[3, 4]}
          py={[2, 3]}
        borderRadius="14px"
        borderBoxing='border-box'
        borderStyle={Config.SOLID}
        borderWidth='1px'
        backgroundColor={Config.TEAL_TINT}
        borderColor={Config.TEAL_BORDER_SOFT}
        _hover={{ backgroundColor: Config.TEAL_TINT_HOVER, transform: 'translateY(-1px)' }}
        transition="all 0.16s ease"
        letterSpacing="0.04em"
        fontWeight="bold"
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
  <header className="top-0 z-50 pl-3 pr-2 md:px-16 py-[0.75rem] md:py-[0.75rem]" style={{ backgroundColor: Config.HEADER_BACKGROUND_COLOR, borderBottom: `2.5px solid ${Config.TEAL_BORDER}` }} >
      <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
        <Logo />
        <div className="flex items-center gap-2 md:gap-4 pl-4 md:pl-8">
          {tokenValue ? <AdminButton /> : <WhatsAppGroupButton />}
          <About />
        </div>
      </div>
    </header>
  );
}