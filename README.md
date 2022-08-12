# PolkaScanner

This is a simple Polkadot/Substrate event scanner.

- Connects to any WebSocket RPC endpoint for a Substrate-based chain
- Live mode (display events as they are received) or query mode (fetch events in a specified range of blocks)
- Displays block number, event name, and data received as JSON or formatted
- Filters events by type

## Libraries used

- [@polkadot/api](https://polkadot.js.org/api)
- [Express](https://expressjs.com)
- [ReactJS](https://reactjs.org)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Chakra UI](https://chakra-ui.com)
- [React Table](https://tanstack.com/table)
- [Cypress](https://jestjs.io)

## Commands

### Installation

```bash
yarn install
```

### Development

```bash
yarn dev 
# Deployed at http://localhost:3000
```

### Build client and server

```bash
yarn build
```

### Start server

```bash
yarn start
# Visit http://localhost:3001 and provide credentials
```

### Run e2e tests

```bash
yarn test
```
