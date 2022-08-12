import { Endpoints } from '../types';

export const DEFAULT_ENDPOINT = 'wss://rpc.polkadot.io';

export const WELL_KNOWN_ENDPOINTS: Endpoints = [
  { url: 'wss://rpc.polkadot.io', name: 'Polkadot' },
  { url: 'wss://kusama-rpc.polkadot.io', name: 'Kusama' },
  { url: 'wss://acala-rpc-0.aca-api.network', name: 'Acala' },
  { url: 'wss://karura-rpc-0.aca-api.network', name: 'Karura' },
];

export const MAX_BLOCK_RANGE = 100;

export const MAX_RECENTLY_USED = 6;
