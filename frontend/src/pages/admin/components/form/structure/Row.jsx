import { HStack } from "@chakra-ui/react";

export default function Row({ children, ...props }) {
  return (
    <HStack
      spacing={{ base: 4, md: 8 }}
      align="flex-start"
      w="100%"
      flexDirection={{ base: 'column', md: 'row' }}
      {...props}
    >
      {children}
    </HStack>
  );
}
