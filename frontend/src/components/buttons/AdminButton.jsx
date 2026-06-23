import { Button } from "@chakra-ui/react";
import * as Config from 'config/index.jsx';
import * as Classes from 'config/classes.jsx';

const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE;

export default function AdminButton() {
  function handleAdmin() {
    window.location.href = Config.ROUTE_HOME + ADMIN_ROUTE;
  }
  return (
    <div className={Classes.ADMIN_BUTTON_WRAPPER}>
      <Button
        variant={Config.SOLID}
        size={Config.SMALL}
        color={Config.SECONDARY_COLOR}
        px={4}
        py={2}
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
        onClick={handleAdmin}
      >
        {Config.ADMIN_LABEL}
      </Button>
    </div>
  );
}
