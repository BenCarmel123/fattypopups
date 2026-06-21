import { Button } from "@chakra-ui/react";
import * as Config from 'config/index.jsx';

const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE;

export default function AdminButton() {
  function handleAdmin() {
    window.location.href = "/" + ADMIN_ROUTE;
  }
  return (
    <div className="flex items-center">
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
        fontWeight="bold"
        onClick={handleAdmin}
      >
        Admin
      </Button>
    </div>
  );
}
