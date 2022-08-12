import { ApiPromise } from '@polkadot/api';

export type Endpoints = { name: string; url: string }[];

export type ApiAction =
  | { type: 'INIT'; payload?: string }
  | { type: 'CONNECTED'; payload: ApiPromise }
  | { type: 'READY'; payload: ChainProperties }
  | { type: 'ERROR'; payload: string }
  | { type: 'LATEST'; payload: number };

export interface ApiState {
  api: ApiPromise;
  chainProperties: ChainProperties;
  endpoint: string;
  error: string | null;
  isConnected: boolean;
  isReady: boolean;
  latestBlock: number;
}

export interface ChainProperties {
  tokenDecimals: number;
  systemChain: string;
  tokenSymbol: string;
}

export interface UseEndpoints {
  recentlyUsed: Endpoints;
  lastUsed: string;
  setLastUsed: React.Dispatch<React.SetStateAction<string>>;
  addEndpoint: (_: string, __: string) => void;
}
