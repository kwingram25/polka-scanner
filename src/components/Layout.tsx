import { isMobile } from 'react-device-detect';

import { Box, Flex, ResponsiveObject, ResponsiveValue } from '@chakra-ui/react';

import { EventTable } from './EventTable';
import { MainMenu } from './MainMenu';

// Only apply md responsive props if device is not mobile
function responsiveProps<T>({
  base,
  md,
  ...breakpoints
}: ResponsiveObject<T>): ResponsiveValue<T> {
  return { base, ...(isMobile ? {} : { md }), ...breakpoints };
}

export function Layout(): JSX.Element {
  return (
    <Flex
      alignItems="flex-start"
      flexDirection={responsiveProps({ base: 'column', md: 'row' })}
      position="relative"
    >
      <Box
        position={responsiveProps({ md: 'sticky', base: 'static' })}
        top="0"
        width={responsiveProps({ md: '350px', base: '100%' })}
      >
        <MainMenu />
      </Box>
      <Box
        bg={responsiveProps({ md: 'gray.900', base: 'transparent' })}
        minH={responsiveProps({ md: '100vh', base: undefined })}
        width={responsiveProps({ md: 'calc(100vw - 350px)', base: '100%' })}
      >
        <EventTable />
      </Box>
    </Flex>
  );
}
