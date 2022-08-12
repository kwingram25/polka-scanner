import { Box, Text } from '@chakra-ui/react';

import { useApi } from '../../contexts/ApiContext';

import { ClearResults } from './ClearResults';
import { FilterEvents } from './FilterEvents';
import { QueryForm } from './QueryForm';
import { RpcControl } from './RpcControl';

function MenuModule({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Box bg="gray.900" boxShadow="2xl" m={4} rounded="md">
      <Box w="100%">{children}</Box>
    </Box>
  );
}

export function MainMenu() {
  const { isReady, latestBlock } = useApi();

  return (
    <Box>
      <Text
        as="h1"
        fontFamily="monospace"
        fontSize="2xl"
        pb={2}
        pt={4}
        textAlign="center"
        textColor="pink.400"
      >
        PolkaScanner
      </Text>
      <MenuModule>
        <RpcControl />
      </MenuModule>
      {isReady && latestBlock !== 0 && (
        <>
          <MenuModule>
            <QueryForm />
          </MenuModule>
          <MenuModule>
            <FilterEvents />
          </MenuModule>
          <MenuModule>
            <ClearResults />
          </MenuModule>
        </>
      )}
    </Box>
  );
}
