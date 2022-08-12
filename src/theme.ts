import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  components: {
    Link: {
      baseStyle: {
        textColor: 'pink.500',
        _hover: {
          textColor: 'pink.300',
        },
      },
    },
  },
  global: {
    a: {
      textColor: 'pink.500',
      _hover: {
        textColor: 'pink.300',
      },
    },
  },
});

export default theme;
