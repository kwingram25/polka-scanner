// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add('getTableContainer', () => {
  cy.get('[data-cy="table-container"]')
});
Cypress.Commands.add('getStartBlock', () => {
  cy.get('[data-cy="input-startBlock"]')
});
Cypress.Commands.add('getStartBlockInput', () => {
  cy.get('[data-cy="input-startBlock"]').find('input').first()
});
Cypress.Commands.add('getEndBlock', () => {
  cy.get('[data-cy="input-endBlock"]')
});
Cypress.Commands.add('getEndBlockInput', () => {
  cy.get('[data-cy="input-endBlock"]').find('input').first()
});
Cypress.Commands.add('getLatestBlock', () => {
  cy.get('[data-cy="latest-block"]')
});
Cypress.Commands.add('waitForCompleteScan', () => {
  cy.get('[data-cy="scan-progress"]').invoke('css', 'width')
  .then((tableContainerWidth) => {
    cy.get('[data-cy="scan-progress"]').find('div').first({ timeout: 20000 }).invoke('css', 'width').should('equal', tableContainerWidth)
  });
});

