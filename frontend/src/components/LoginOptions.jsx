import { Button } from "@chakra-ui/react";
import { MANUAL, MEDIUM, SOLID, XL, FLEX, BOLD, CENTER, MINIMAL_TRANSFORM, MINIMAL_TRANSITION } from "./config/strings.jsx";
import { ADMIN_PANEL_COLOR, WHITE } from "./config/colors";

const handleGoogle = () =>
      window.location.href = 'http://localhost:5000/auth/google'

export default function LoginOptions({handleClick}) {
   return ( 
    <div style={{ display: FLEX, justifyContent: CENTER, gap: '1rem', marginTop: '1rem', color: WHITE, fontWeight: BOLD }}>
        <Button type="button" variant={SOLID} px={6} py={6} boxShadow={MEDIUM} borderRadius={XL} backgroundColor={ADMIN_PANEL_COLOR} _hover={{ transform: MINIMAL_TRANSFORM }} transition={MINIMAL_TRANSITION} onClick={ handleGoogle }>GOOGLE</Button>
        <Button type="button" variant={SOLID} px={6} py={6} boxShadow={MEDIUM} borderRadius={XL} backgroundColor={ADMIN_PANEL_COLOR} _hover={{ transform: MINIMAL_TRANSFORM }} transition={MINIMAL_TRANSITION} onClick={ handleClick (MANUAL, undefined) }>MANUAL</Button>
    </div>
   )
}


