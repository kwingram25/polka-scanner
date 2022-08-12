import { Box, Button, chakra, Flex } from '@chakra-ui/react';

import { useEvents } from '../../contexts';

export function ClearResults() {
  const { clearEvents, events, filteredCount, isScanning } = useEvents();

  return (
    <Flex data-cy="clear-results">
      <Box flex={1} p={2}>
        {events.length - filteredCount} results
        {filteredCount > 0 && (
          <>
            {' '}
            <chakra.span>({filteredCount} hidden)</chakra.span>
          </>
        )}{' '}
      </Box>
      <Button
        _hover={{ bg: 'red.700' }}
        bg="red.900"
        isDisabled={isScanning || events.length === 0}
        rounded="md"
        onClick={clearEvents}
      >
        Clear All
      </Button>
    </Flex>
  );
}
