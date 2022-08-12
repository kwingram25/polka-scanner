import { Box } from '@chakra-ui/react';

import { useEvents } from '../../contexts';

export const SCAN_PROGRESS_HEIGHT = '6px';

export function ScanProgress() {
  const { scanPercentage } = useEvents();
  return (
    <Box
      bg="gray.900"
      data-cy="scan-progress"
      height={SCAN_PROGRESS_HEIGHT}
      position="sticky"
      top="0"
      width="100%"
      zIndex={200}
    >
      <Box bg="pink.500" height="100%" width={`${scanPercentage * 100}%`} />
    </Box>
  );
}
