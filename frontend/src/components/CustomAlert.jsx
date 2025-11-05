import { Alert, CloseButton } from "@chakra-ui/react";

export default function MyAlert({ status = "info", title, description, onClose }) {
  return (
    <Alert.Root status={status} borderRadius="md" boxShadow="md" variant="subtle" position="relative" mb={4}>
      <Alert.Indicator />
      <Alert.Title mr={2} colorPalette="red" >{title}</Alert.Title>
      {description && <Alert.Description >{description}</Alert.Description>}
      <CloseButton position="absolute" right="8px" top="16px" onClick={onClose} />
    </Alert.Root>
  );
}