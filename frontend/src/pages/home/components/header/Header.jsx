import React from "react"
import { Button } from "@chakra-ui/react";
import Logo from './Logo.jsx';
import AdminButton from '../../../../components/buttons/AdminButton.jsx';
import WhatsAppGroupButton from './WhatsAppGroupButton.jsx';
import * as Config from 'config/index.jsx';
import * as Classes from 'config/classes.jsx';

function About() {
  function handleAbout() {
    window.location.href = Config.ROUTE_HOME + Config.ABOUT_ROUTE;
  }
  return (
      <div className={Classes.HEADER_ABOUT_WRAPPER}>
      <Button
          variant={Config.SOLID}
          size={[Config.SMALL, Config.MEDIUM]}
          fontSize={[Config.SMALL, Config.MEDIUM]}
          color={Config.SECONDARY_COLOR}
          px={[3, 5]}
          py={[2, 4]}
        borderRadius="14px"
        borderBoxing='border-box'
        borderStyle={Config.SOLID}
        borderWidth='1px'
        backgroundColor={Config.TEAL_TINT}
        borderColor={Config.TEAL_BORDER_SOFT}
        _hover={{ backgroundColor: Config.TEAL_TINT_HOVER, transform: 'translateY(-1px)' }}
        transition="all 0.16s ease"
        letterSpacing="0.04em"
        fontWeight={Config.BOLD}
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
  <header className={Classes.HEADER} style={{ backgroundColor: Config.HEADER_BACKGROUND_COLOR, borderBottom: `2.5px solid ${Config.TEAL_BORDER}` }} >
      <div className={Classes.HEADER_INNER}>
        <Logo />
        <div className={Classes.HEADER_NAV}>
          {tokenValue ? <AdminButton /> : <WhatsAppGroupButton />}
          <About />
        </div>
      </div>
    </header>
  );
}