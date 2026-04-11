import { Alert } from "@chakra-ui/react";
import * as Config from "config/index.jsx";

export default function MyAlert({ status = "info", title, description, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position: Config.FIXED, inset: 0, zIndex: 999, backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />
      <Alert.Root status={status} borderRadius="2xl" boxShadow={Config.MEDIUM} variant={Config.SUBTLE} position={Config.FIXED} top="50%" left="50%" transform="translate(-50%, -50%)" zIndex={1000} width="fit-content" maxWidth="calc(100% - 2rem)" minWidth="280px" w="fit-content" p={5} fontSize="xl" flexDirection="column" alignItems="flex-start" gap={3}>
        <Alert.Title colorPalette="red" fontWeight={Config.BOLD}>{title}</Alert.Title>
        {description && <Alert.Description fontWeight={Config.BOLD} lineHeight="1.6">{description}</Alert.Description>}
      </Alert.Root>
    </>
  );
}