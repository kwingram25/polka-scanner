import type { Reducer } from 'react';

import { DEFAULT_ENDPOINT } from '../constants';
import type { ApiAction, ApiState } from '../types';

export const INIT_STATE = {
  api: null,
  chainProperties: null,
  error: null,
  isConnected: false,
  isReady: false,
  latestBlock: 0,
  endpoint: DEFAULT_ENDPOINT,
} as unknown as ApiState;

export const reducer: Reducer<ApiState, ApiAction> = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        ...INIT_STATE,
        endpoint: action.payload || DEFAULT_ENDPOINT,
        error: null,
      };

    case 'CONNECTED':
      return { ...state, api: action.payload, isConnected: true, error: null };

    case 'READY':
      return {
        ...state,
        chainProperties: action.payload,
        isReady: true,
        error: null,
      };

    case 'ERROR':
      return {
        ...state,
        error: action.payload || 'Unknown error',
        isReady: false,
      };

    case 'LATEST':
      return { ...state, latestBlock: action.payload };

    default:
      throw new Error(`Unknown action type`);
  }
};
