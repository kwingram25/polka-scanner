import { ThemeProvider } from '@chakra-ui/system';
import { mount } from 'cypress/react';
import theme from '../../src/theme'
import React from 'react';

import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', (jsx, options) =>
  mount(React.createElement(ThemeProvider, { theme }, jsx), options)
);
