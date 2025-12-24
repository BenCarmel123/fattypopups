import { MINIMAL_TRANSITION, CENTER, LARGE, XL, XXL, MAX, SMALL } from "../../components/config/strings.jsx";
import { WHITE, BORDER_COLOR, HOVER, GRAY, BACKGROUND_COLOR } from "../../components/config/colors.jsx";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

const handleGoogle = () => {
  window.location.href = "http://localhost:5000/auth/google";
};

export default function Login() {
  return (
    <Flex minH="50vh" align={CENTER} justify={CENTER} px={4}>
      <Box w={MAX} maxW={LARGE} bg={WHITE} rounded={XXL} shadow={XL} p={{ base: 8, md: 12 }} border="1px solid" borderColor={BORDER_COLOR}>
        <Box textAlign={CENTER} mb={2}>
        </Box>

        <Button onClick={handleGoogle} variant="outline" w={MAX} rounded={XL} borderColor={HOVER} _hover={{ bg: "gray.50", borderColor: "gray.300" }} transition={MINIMAL_TRANSITION}>
          <FcGoogle />
            <Text fontWeight={LARGE} color={GRAY} fontSize={XXL}>
            Continue with Google
          </Text>
        </Button>
      </Box>
    </Flex>
  );
}


