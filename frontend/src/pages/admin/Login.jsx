import { MINIMAL_TRANSITION, CENTER, APP_NAME, LARGE, XL, XXL } from "../../components/config/strings.jsx";
import { WHITE, BORDER_COLOR, HOVER, GRAY } from "../../components/config/colors.jsx";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

const handleGoogle = () => {
  window.location.href = "http://localhost:5000/auth/google";
};

const LOGO_URL = process.env.REACT_APP_LOGO;

export default function Login() {
  return (
    <Flex minH="90vh" align={CENTER} justify={CENTER} px={10}>
      <Box bg={WHITE} rounded={XXL} shadow={XL} p={6} border="3px solid" borderColor={BORDER_COLOR}>
        <div direction="column"
        align={CENTER}
        justify={CENTER}>
        <img src={LOGO_URL} alt={APP_NAME} className="h-42 w-40" style={{width:'9rem', backgroundColor:HOVER, borderRadius:"16px", padding:"10px"}} />
        <br></br>
        <Button onClick={handleGoogle} variant="outline" padding="0.8rem" size={LARGE} rounded={XXL} border="3px solid" borderColor={BORDER_COLOR} _hover={{ bg: HOVER }} transition={MINIMAL_TRANSITION}>
          <FcGoogle />
          <Text fontWeight="semibold" color={GRAY} fontSize={LARGE}>
            Admin
          </Text>
        </Button>
        </div>
      </Box>
    </Flex>
  );
}


