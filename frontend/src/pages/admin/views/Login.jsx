import * as Config from 'config/index.jsx';
import { FcGoogle } from 'config/index.jsx';
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import * as Classes from 'config/classes.jsx';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const handleGoogle = () => {
  window.location.href = `${SERVER_URL}${Config.AUTH_GOOGLE_PATH}`;
};

export default function Login() {
  return (
    <Flex minH="90vh" align={Config.CENTER} justify={Config.CENTER} px={10}>
      <Box bg={Config.WHITE} rounded={Config.XXL} shadow={Config.XL} p={6} border="3px solid" borderColor={Config.BORDER_COLOR}>
        <div direction="column"
        align={Config.CENTER}
        justify={Config.CENTER}>
        <img src={Config.LOGO_URL} alt={Config.APP_NAME} className={Classes.LOGIN_LOGO_IMG} style={{width:'9rem', backgroundColor:Config.HOVER_COLOR, borderRadius:"16px", padding:"10px"}} />
        <br></br>
        <Button onClick={handleGoogle} variant={Config.OUTLINE} padding="0.8rem" size={Config.LARGE} rounded={Config.XXL} border="3px solid" borderColor={Config.BORDER_COLOR} _hover={{ bg: Config.HOVER_COLOR }} transition={Config.MINIMAL_TRANSITION}>
          <FcGoogle />
          <Text fontWeight="semibold" color={Config.GRAY} fontSize={Config.LARGE}>
            {Config.ADMIN_LABEL}
          </Text>
        </Button>
        </div>
      </Box>
    </Flex>
  );
}
