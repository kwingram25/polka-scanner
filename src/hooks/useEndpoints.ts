import { useCallback } from 'react';
import useLocalStorage from 'use-local-storage';

import {
  DEFAULT_ENDPOINT,
  MAX_RECENTLY_USED,
  WELL_KNOWN_ENDPOINTS,
} from '../constants';
import { Endpoints, UseEndpoints } from '../types';

export function useEndpoints(): UseEndpoints {
  const [recentlyUsed, setRecentlyUsed] = useLocalStorage<Endpoints>(
    'recentlyUsed',
    []
  );

  const [lastUsed, setLastUsed] = useLocalStorage('lastUsed', DEFAULT_ENDPOINT);

  const addEndpoint = useCallback(
    (url: string, name: string) => {
      if (!WELL_KNOWN_ENDPOINTS[url]) {
        setRecentlyUsed((prev) => [
          {
            name,
            url,
          },
          ...prev
            .filter((endpoint) => endpoint.url !== url)
            .slice(0, MAX_RECENTLY_USED - 1),
        ]);
      }
    },
    [setRecentlyUsed]
  );

  return {
    recentlyUsed,
    addEndpoint,
    lastUsed,
    setLastUsed,
  };
}
