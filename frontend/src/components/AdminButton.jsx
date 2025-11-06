import React from 'react';
import { Button } from '@chakra-ui/react';
import { RiMailLine } from "react-icons/ri";
import { SECONDARY_COLOR, TRANSPARENT, WHITE } from './config/colors.jsx';
import { handleRoute } from './config/utils.jsx';
import { NONE, FIXED, SUBTLE } from './config/strings.jsx';

// Admin button component - for development purposes
const Admin = () => { 
  function handleAdmin() {
    handleRoute(process.env.REACT_APP_ADMIN_ROUTE);
  }
  return (
    <>
      <div>
        <Button
          variant={SUBTLE}
          style={{ position: FIXED, bottom: '1.5rem', right: '1.5rem', background: TRANSPARENT, boxShadow: NONE, opacity: 0.7, _hover: { background: SECONDARY_COLOR, color: WHITE } }}
          onClick={handleAdmin}>
          <RiMailLine /> Admin
        </Button>
      </div>
    </>
  );
}
