import { useMemo } from 'react';

import { SearchIcon, WarningIcon } from '@chakra-ui/icons';
import { CircularProgress, Flex, Text } from '@chakra-ui/react';

import { useApi, useEvents } from '../../contexts';

function LoadingSpinner() {
  return (
    <CircularProgress
      color="pink.500"
      isIndeterminate
      mb={4}
      size="70px"
      trackColor="transparent"
    />
  );
}

export function EmptyTableView() {
  const { error, isReady } = useApi();
  const { events, filteredCount, isScanning, isFirstScanAttempt, scanMode } =
    useEvents();

  const [icon, headline, subtitle] = useMemo(() => {
    if (error) {
      return [
        <WarningIcon color="red.500" h={70} mb={4} w={70} />,
        'Unable to connect',
        error,
      ];
    }

    if (!isReady) {
      return [<LoadingSpinner />, 'Connecting to chain...'];
    }

    if (scanMode === 'live' && events.length === 0 && filteredCount === 0) {
      return [<LoadingSpinner />, 'Waiting for new events...'];
    }

    if (scanMode === 'query') {
      if (isFirstScanAttempt) {
        return [
          <SearchIcon color="pink.500" h={70} mb={4} w={70} />,
          'Select a start and end block to query events in range',
        ];
      }

      if (isScanning) {
        return [<LoadingSpinner />, 'Scanning for events...'];
      }
    }

    return [
      <Text fontSize="5xl" textColor="pink.500">
        ¯\_(ツ)_/¯
      </Text>,
      'No events found',
      filteredCount > 0 ? `${events.length} results hidden by filters` : null,
    ];
  }, [
    error,
    events,
    filteredCount,
    isReady,
    isFirstScanAttempt,
    isScanning,
    scanMode,
  ]);

  return (
    <Flex bgColor="gray.900" justifyContent="center" w="100%">
      <Flex
        alignItems="center"
        bgColor="gray.900"
        flex="1"
        flexDirection="column"
        flexGrow="1"
        justifyContent="center"
        maxW="60%"
        minH="300px"
        textAlign="center"
      >
        <Flex
          alignItems="center"
          h="7rem"
          justifyContent="center"
          mb={2}
          w="20rem"
        >
          {icon}
        </Flex>
        <Text fontFamily="monospace" fontSize="lg" mb={2} textColor="white">
          {headline}
        </Text>
        <Text fontFamily="monospace" fontSize="sm" textColor="gray.300">
          {subtitle}
        </Text>
      </Flex>
    </Flex>
  );
}
