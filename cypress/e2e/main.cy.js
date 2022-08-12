/// <reference types="cypress" />

describe('Basic E2E run-through', () => {
  it('connects and displays the chain control', () => {
    cy.visit('http://localhost:3000', { timeout: 20000 })

    cy.getTableContainer().should('include.text', 'Connecting to chain')

    const chainButton = cy.get('[data-cy="chain-button"]')

    chainButton.should('include.text', 'Polkadot');
    chainButton.should('include.text', 'wss://rpc.polkadot.io');
  })

  it('displays query mode control', () => {
    cy.getTableContainer().should('include.text', 'Waiting for new events')

    const modeControl = cy.get('[data-cy="mode-control"]');

    modeControl.should('include.text', 'Live');
    modeControl.should('include.text', 'Query');
  })

  it('switches from live to query scan mode', () => {
    cy.get('[data-cy="mode-control"] button:nth-child(2)').click();

    cy.getTableContainer().should('include.text', 'Select a start and end block')

    cy.getTableContainer().get('td').should('not.exist');
  })

  it('validates block range query parameters', () => {
    cy.getTableContainer().should('include.text', 'Select a start and end block')

    cy.getTableContainer().get('td').should('not.exist');

    cy.get('[data-cy="latest-block"]')
    .invoke('attr', 'data-value')
    .then((latestBlock) => {
      cy.getEndBlockInput().should('have.value', latestBlock);
    })

    cy.get('[data-cy=use-manual').click()

    cy.getEndBlockInput().should('not.be.disabled');

    cy.getEndBlockInput().clear().type(10000050);

    cy.getEndBlock().should('include.text', 'Cannot be less than')

    cy.getStartBlock().should('include.text', 'Cannot be greater than')

    cy.getStartBlockInput().clear().type(9999949);

    cy.getStartBlock().should('include.text', 'Cannot query more than')

    cy.getStartBlockInput().clear().type(10000000).blur()

  });


  it('queries for events in a range of blocks', () => {
    cy.get('[data-cy=scan-button]').click();

    cy.getTableContainer().should('include.text', 'Scanning for events')

    cy.getTableContainer().find('tbody', { timeout: 50000 })
      .should('have.length', 100)

    cy.get('[data-cy=clear-results]')
      .should('include.text', '100 results')

    cy.get('[data-cy=filter-menu]').click()
    
    cy.get('#react-select-2-listbox')
      .get('div').contains('balances.Transfer')
        .click().wait(5000)

    cy.getTableContainer().find('tbody', { timeout: 20000 })
      .should('have.length', 41)

    cy.get('[data-cy=clear-results]')
      .should('include.text', '41 results (59 hidden)')

    cy.getTableContainer().find('tbody').first().click()
      .wait(2000)
      .should('include.text', 'from: AccountId')
      .should('include.text', 'to: AccountId')
      .should('include.text', 'amount: u128')
      .should('include.text', '13xKAEHq8YiyNfGWawXaE2zNbho3NVJQHHnKxe4waGnVUdcM')
      .should('include.text', '12nr7GiDrYHzAYT9L8HdeXnMfWcBuYfAXpgfzf3upujeCciz')
      .should('include.text', '25.8000 DOT')

    cy.get('button').contains('Clear All').click().wait(5000)

    cy.getTableContainer().find('tbody').should('have.length', 0)

    cy.getTableContainer().should('include.text', 'No events found')

  })

  it('switches to another RPC endpoint', () => {
    cy.get('[data-cy="chain-button"]').click()

    cy.get('[data-cy=rpc-modal]').as('rpcModal').should('exist')

    cy.get('[data-cy=rpc-endpoint-form]').as('rpcInput').find('input').first()
      .should('have.value', 'wss://rpc.polkadot.io')
      .clear()

    cy.get('@rpcModal').should('include.text', 'Invalid RPC endpoint')

    cy.get('@rpcInput').type('wss://kusama-rpc.polkadot.io')

    cy.get('@rpcModal').should('include.text', 'Valid RPC endpoint found!')
      .find('button').contains('Switch').should('exist')
      .click()
    
    cy.get('@rpcModal').should('not.exist')

    cy.getTableContainer().should('include.text', 'Connecting to chain')

    cy.get('[data-cy="chain-button"]')
      .should('include.text', 'Kusama')
      .should('include.text', 'wss://kusama-rpc.polkadot.io');
  })
})
