import { Alert } from "@chakra-ui/react";
import { RED } from "./config/colors.jsx";
import { MEDIUM, RELATIVE, SUBTLE } from "./config/strings.jsx";

export default function MyAlert({ status = "info", title, description, onClose }) {
  return (
    <Alert.Root status={status} borderRadius={MEDIUM} boxShadow={MEDIUM} variant={SUBTLE} position={RELATIVE} mb={4}>
      <Alert.Indicator />
      <Alert.Title mr={2} colorPalette={RED} >{title}</Alert.Title>
      {description && <Alert.Description >{description}</Alert.Description>}
    </Alert.Root>
  );
}