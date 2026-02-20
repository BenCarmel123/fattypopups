import { Alert } from "@chakra-ui/react";
import * as Config from "../config/index.jsx";

export default function MyAlert({ status = "info", title, description, onClose }) {
  return (
    <Alert.Root status={status} borderRadius={Config.MEDIUM} boxShadow={Config.MEDIUM} variant={Config.SUBTLE} position={Config.RELATIVE} mb={4}>
      <Alert.Indicator />
      <Alert.Title mr={2} colorPalette={Config.RED} >{title}</Alert.Title>
      {description && <Alert.Description >{description}</Alert.Description>}
    </Alert.Root>
  );
}