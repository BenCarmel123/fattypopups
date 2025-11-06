import React from 'react';
import { Button } from '@chakra-ui/react';
import { RiMailLine } from "react-icons/ri";
import { SECONDARY_COLOR } from './config/colors.jsx';
import { handleRoute } from './config/utils.jsx';

// Admin button component - for development purposes
const Admin = () => { 
  function handleAdmin() {
    handleRoute(process.env.REACT_APP_ADMIN_ROUTE);
  }
  return (
    <>
      <div>
        <Button
          variant="subtle"
          style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', background: 'transparent', boxShadow: 'none', opacity: 0.7, _hover: { background: SECONDARY_COLOR, color: 'white' } }}
          onClick={handleAdmin}>
          <RiMailLine /> Admin
        </Button>
      </div>
    </>
  );
}
