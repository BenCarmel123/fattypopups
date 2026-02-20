import React from "react"
import { Button } from "@chakra-ui/react";
import * as Config from '../config/index.jsx';

const ADMIN_ROUTE = process.env.REACT_APP_ADMIN_ROUTE;

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
        onClick={handleAdmin}
      >
        Admin
      </Button>
    </div>
  );
}
