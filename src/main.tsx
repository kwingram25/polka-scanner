import React from 'react';
import ReactDOM from 'react-dom';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { css, Global } from '@emotion/react';

import 'focus-visible/dist/focus-visible';

import App from './App';
import theme from './theme';

const GlobalStyles = css`
  /*
    This will hide the focus indicator if the element receives focus    via the mouse,
    but it will still show up on keyboard focus.
  */
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

ReactDOM.render(
  <ChakraProvider theme={theme}>
    {
      /* Current known issue with dark mode not working in production
        - https://github.com/chakra-ui/chakra-ui/discussions/5051 */
      localStorage.setItem('chakra-ui-color-mode', 'dark')
    }
    <ColorModeScript initialColorMode="dark" />
    <Global styles={GlobalStyles} />
    <App />
  </ChakraProvider>,
  document.getElementById('root')
);
