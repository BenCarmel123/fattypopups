import { HStack, Text } from "@chakra-ui/react";
import { BACKGROUND_COLOR } from "config/index.jsx";

export default function AddChef({ onClick, label, disabled = false }) {
  return (
    <HStack
      cursor={disabled ? "not-allowed" : "pointer"}
      onClick={disabled ? undefined : onClick}
      color={disabled ? "gray.400" : BACKGROUND_COLOR}
      backgroundColor="transparent"
      _hover={disabled ? {} : { opacity: 0.7 }}
      width="fit-content"
      opacity={disabled ? 0.5 : 1}
      padding="0.25rem 0.5rem"
      fontSize="sm"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="md"
    >
      <Text>+</Text>
      <Text>{label}</Text>
    </HStack>
  );
}