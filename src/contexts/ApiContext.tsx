import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';

import { getChainProperties } from '../api';
import { WELL_KNOWN_ENDPOINTS } from '../constants';
import { useEndpoints } from '../hooks/useEndpoints';
import { INIT_STATE, reducer } from '../reducers/api';
import type { ApiState, UseEndpoints, VoidFn } from '../types';

interface Value extends ApiState, UseEndpoints {
  setEndpoint: (_: string) => void;
}

let _api: ApiPromise;

const ApiContext = createContext<Value>({} as unknown as Value);

export function ApiContextProvider({
  children,
}: React.PropsWithChildren<Partial<Value>>) {
  const { addEndpoint, recentlyUsed, lastUsed, setLastUsed } = useEndpoints();
  const [state, dispatch] = useReducer(reducer, {
    ...INIT_STATE,
    endpoint: lastUsed,
  });

  useEffect(() => {
    try {
      if (_api) {
        _api.disconnect();
      }

      const provider = new WsProvider(state.endpoint);
      _api = new ApiPromise({ provider });

      _api.on('connected', async () => {
        dispatch({ type: 'CONNECTED', payload: _api });
        // `ready` event is not emitted upon reconnection and is checked explicitly here.
        await _api.isReady;

        const chainProperties = await getChainProperties(_api);

        if (!WELL_KNOWN_ENDPOINTS.find(({ url }) => url === state.endpoint))
          addEndpoint(state.endpoint, chainProperties.systemChain);

        setLastUsed(state.endpoint);

        dispatch({ type: 'READY', payload: chainProperties });
      });

      _api.on('error', (e) => {
        dispatch({ type: 'ERROR', payload: (e as Error).message });
      });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: (e as Error).message });
    }
  }, [addEndpoint, setLastUsed, state.endpoint]);

  useEffect(() => {
    let unsub: VoidFn | undefined;

    async function subscribe() {
      unsub = await state.api?.rpc.chain.subscribeNewHeads((lastHeader) => {
        dispatch({ type: 'LATEST', payload: lastHeader.number.toNumber() });
      });
    }

    if (state.isReady) {
      subscribe();
    }

    return () => {
      if (unsub) unsub();
    };
  }, [state.api?.rpc.chain, state.isReady]);

  const setEndpoint = useCallback((endpoint: string): void => {
    dispatch({ type: 'INIT', payload: endpoint });
  }, []);

  const value = useMemo(
    () => ({
      api: state.api,
      chainProperties: state.chainProperties,
      endpoint: state.endpoint,
      error: state.error,
      isConnected: state.isConnected,
      isReady: state.isReady,
      latestBlock: state.latestBlock,
      addEndpoint,
      lastUsed,
      recentlyUsed,
      setEndpoint,
      setLastUsed,
    }),
    [
      state.api,
      state.chainProperties,
      state.endpoint,
      state.error,
      state.isConnected,
      state.isReady,
      state.latestBlock,
      addEndpoint,
      lastUsed,
      setEndpoint,
      setLastUsed,
      recentlyUsed,
    ]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export const useApi = () => useContext(ApiContext);
