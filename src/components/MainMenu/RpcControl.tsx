import { useMemo, useState } from 'react';

import { Box, Button, chakra, CircularProgress } from '@chakra-ui/react';

import { useApi } from '../../contexts';

import { RpcModal } from './RpcModal';

export function RpcControl() {
  const {
    endpoint,
    error,
    isReady,
    isConnected,
    chainProperties,
    latestBlock,
  } = useApi();
  const [isOpen, setIsOpen] = useState(false);

  const [statusIndicator, statusText] = useMemo(() => {
    if (error) {
      return [
        <Box bg="red.500" height={2} rounded="md" width={2} />,
        'Error connecting',
      ];
    }

    if (!isConnected || !isReady) {
      return [
        <CircularProgress
          color="yellow.500"
          isIndeterminate
          size="12px"
          trackColor="transparent"
        />,
        'Connecting...',
      ];
    }

    return [
      <Box bg="green.500" height={2} rounded="md" width={2} />,
      chainProperties?.systemChain || 'Connected',
    ];
  }, [chainProperties?.systemChain, isConnected, isReady, error]);

  return (
    <>
      <Button
        _hover={{
          bg: 'gray.600',
        }}
        alignItems="center"
        bg="gray.700"
        data-cy="chain-button"
        fontWeight={500}
        h={16}
        justifyContent="flex-start"
        m={0}
        p={0}
        rounded="md"
        variant="unstyled"
        w="100%"
        onClick={() => setIsOpen(true)}
      >
        <Box
          alignItems="center"
          d="flex"
          maxWidth="100%"
          overflowX="hidden"
          p="2"
          textOverflow="ellipsis"
        >
          <Box mr="2" w={2}>
            {statusIndicator}
          </Box>
          <Box flexGrow={1} overflowX="hidden" textAlign="left">
            {statusText}
            {isReady && latestBlock > 0 && (
              <chakra.span
                data-cy="latest-block"
                data-value={latestBlock}
                float="right"
                fontFamily="monospace"
                fontSize="xs"
              >
                #{latestBlock.toLocaleString()}
              </chakra.span>
            )}
            <Box
              color="gray.300"
              fontFamily="monospace"
              fontSize="xs"
              overflowX="hidden"
              textOverflow="ellipsis"
            >
              {endpoint}
            </Box>
          </Box>
        </Box>
      </Button>
      <RpcModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
