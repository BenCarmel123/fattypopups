import * as Config from 'config/index.jsx';
import { Box, Button, Flex, Text } from "@chakra-ui/react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL
const LOGO_URL = process.env.REACT_APP_LOGO;

const handleGoogle = () => {
  window.location.href = `${SERVER_URL}/auth/google`;
};

export default function Login() {
  return (
    <Flex minH="90vh" align={Config.CENTER} justify={Config.CENTER} px={10}>
      <Box bg={Config.WHITE} rounded={Config.XXL} shadow={Config.XL} p={6} border="3px solid" borderColor={Config.BORDER_COLOR}>
        <div direction="column"
        align={Config.CENTER}
        justify={Config.CENTER}>
        <img src={LOGO_URL} alt={Config.APP_NAME} className="h-42 w-40" style={{width:'9rem', backgroundColor:Config.HOVER, borderRadius:"16px", padding:"10px"}} />
        <br></br>
        <Button onClick={handleGoogle} variant="outline" padding="0.8rem" size={Config.LARGE} rounded={Config.XXL} border="3px solid" borderColor={Config.BORDER_COLOR} _hover={{ bg: Config.HOVER }} transition={Config.MINIMAL_TRANSITION}>
          <Config.FcGoogle />
          <Text fontWeight="semibold" color={Config.GRAY} fontSize={Config.LARGE}>
            Admin
          </Text>
        </Button>
        </div>
      </Box>
    </Flex>
  );
}


