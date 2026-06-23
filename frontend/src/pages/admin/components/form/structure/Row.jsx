import { HStack } from "@chakra-ui/react";
import * as Config from 'config/index.jsx';

export default function Row({ children, ...props }) {
  return (
    <HStack
      spacing={{ base: 4, md: 8 }}
      align="flex-start"
      w={Config.MAX}
      flexDirection={{ base: 'column', md: 'row' }}
      {...props}
    >
      {children}
    </HStack>
  );
}
