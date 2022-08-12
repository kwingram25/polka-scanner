import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { getEventsFromBlocks } from '../api';
import { INIT_STATE, reducer } from '../reducers/events';
import { EventsState } from '../types/events';

import { useApi } from './ApiContext';

type ScanMode = 'live' | 'query';

interface Value
  extends Pick<
    EventsState,
    | 'events'
    | 'filteredCount'
    | 'filters'
    | 'methods'
    | 'isFirstScanAttempt'
    | 'isScanning'
    | 'scanMode'
    | 'scanPercentage'
  > {
  clearEvents: () => void;
  scanEventsInRange: (_: number, __?: number) => Promise<void>;
  scanEventsLive: () => Promise<void>;
  resetEvents: () => void;
  getFilteredRange: (_: number, __: number) => number[];
  setEventFilters: (_: string[]) => void;
  setFilteredCount: (_: number) => void;
  // removeFilter: (_: string) => void;
  // clearFilters: () => void;
  setScanMode: (_: ScanMode) => void;
}

const EventsContext = createContext<Value>({} as unknown as Value);

export function EventsContextProvider({
  children,
}: React.PropsWithChildren<Partial<Value>>) {
  const { api, latestBlock } = useApi();
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  // const [scanMode, setScanMode] = useState<ScanMode>('live');
  // const [isScanning, setIsScanning] = useState(false);
  // const [isFirstScanAttempt, setIsFirstScanAttempt] = useState(true);
  // const [blocks, setBlocks] = useState<Record<number, boolean>>({});
  // const [events, _setEvents] = useState<Record<string, EventRow>>({});

  const getFilteredRange = useCallback(
    (start: number, end: number): number[] => {
      const count = 1 + end - start;
      const range = [...Array(count).keys()].map((i) => i + start);

      return range.filter(
        (blockNumber) =>
          !state.blocks.includes(blockNumber) && blockNumber <= latestBlock
      );
    },
    [latestBlock, state.blocks]
  );

  const scanEventsLive = useCallback(async () => {
    await getEventsFromBlocks(api, [latestBlock], (blockNumber, newEvents) => {
      dispatch({
        type: 'ADD',
        payload: {
          blockNumber,
          newEvents,
          scanMode: 'live',
        },
      });
    });
  }, [api, latestBlock]);

  const scanEventsInRange = useCallback(
    async (startBlock: number, endBlock?: number) => {
      dispatch({ type: 'SCAN_START' });

      dispatch({ type: 'FILTER_RANGE', payload: { startBlock, endBlock } });

      await getEventsFromBlocks(
        api,
        getFilteredRange(startBlock, endBlock),
        (blockNumber, newEvents, newPercentage) => {
          dispatch({
            type: 'ADD',
            payload: {
              blockNumber,
              newEvents,
              scanMode: 'query',
              scanPercentage: newPercentage,
            },
          });
        }
      );
    },
    [api, getFilteredRange]
  );

  const clearEvents = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const resetEvents = useCallback(() => dispatch({ type: 'RESET' }), []);

  const setScanMode = useCallback(
    (scanMode: 'live' | 'query') =>
      dispatch({ type: 'SCAN_MODE', payload: scanMode }),
    []
  );

  const setEventFilters = useCallback(
    (filters: string[]) => dispatch({ type: 'FILTER_NAMES', payload: filters }),
    []
  );

  const setFilteredCount = useCallback(
    (filteredCount: number) =>
      dispatch({ type: 'FILTERED_COUNT', payload: filteredCount }),
    []
  );

  // const removeFilter = useCallback(
  //   (method: string) => dispatch({ type: 'FILTER_REMOVE', payload: method }),
  //   []
  // );

  // const clearFilters = useCallback(
  //   () => dispatch({ type: 'FILTER_CLEAR' }),
  //   []
  // );

  useEffect((): void => {
    if (state.isScanning && state.scanPercentage >= 1) {
      dispatch({ type: 'SCAN_COMPLETE' });
    }
  }, [state.isScanning, state.scanPercentage]);

  useEffect((): void => {
    clearEvents();
  }, [clearEvents, state.scanMode]);

  const value = useMemo(
    () => ({
      events: state.events,
      filteredCount: state.filteredCount,
      filters: state.filters,
      methods: state.methods,
      isScanning: state.isScanning,
      isFirstScanAttempt: state.isFirstScanAttempt,
      scanMode: state.scanMode,
      scanPercentage: state.scanPercentage,
      setEventFilters,
      setFilteredCount,
      // removeFilter,
      // clearFilters,
      clearEvents,
      resetEvents,
      getFilteredRange,
      scanEventsInRange,
      scanEventsLive,
      setScanMode,
    }),
    [
      state.events,
      state.filteredCount,
      state.filters,
      state.methods,
      state.isScanning,
      state.isFirstScanAttempt,
      state.scanMode,
      state.scanPercentage,
      setEventFilters,
      setFilteredCount,
      // removeFilter,
      // clearFilters,
      clearEvents,
      resetEvents,
      getFilteredRange,
      scanEventsInRange,
      scanEventsLive,
      setScanMode,
    ]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);
