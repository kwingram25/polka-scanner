import { isMobile as isMobileDevice } from 'react-device-detect';

import { useMediaQuery } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/system';

export function useIsMobileView(): boolean {
  const theme = useTheme();

  const [isNarrow] = useMediaQuery(
    `(max-width: ${theme.__breakpoints.asObject.lg}`
  );

  return isNarrow || isMobileDevice;
}
