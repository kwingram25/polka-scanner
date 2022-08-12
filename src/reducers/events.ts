import type { Reducer } from 'react';

import { MAX_BLOCK_RANGE } from '../constants';
import { EventsAction, EventsState } from '../types/events';

export const INIT_STATE: EventsState = {
  events: [],
  filteredCount: 0,
  filters: [],
  blocks: [],
  methods: [],
  isFirstScanAttempt: true,
  isScanning: false,
  scanMode: 'live',
  scanPercentage: 0,
};

export const reducer: Reducer<EventsState, EventsAction> = (state, action) => {
  switch (action.type) {
    // Add events to result set, update lists of unique blocks and methods found
    case 'ADD':
      if (action.payload.scanMode !== state.scanMode) {
        // Discard any live queries that finished late
        return state;
      }

      return {
        ...state,
        blocks: [...new Set([...state.blocks, action.payload.blockNumber])],
        events: action.payload.newEvents.reduce(
          (result, record) => [
            ...result,
            {
              blockNumber: action.payload.blockNumber,
              record,
            },
          ],
          state.events.filter(
            ({ blockNumber }) =>
              blockNumber > action.payload.blockNumber - MAX_BLOCK_RANGE
          )
        ),
        methods: [
          ...new Set([
            ...state.methods,
            ...action.payload.newEvents.map(
              (record) => `${record.event.section}.${record.event.method}`
            ),
          ]),
        ],
        scanPercentage:
          action.payload.scanPercentage !== undefined
            ? action.payload.scanPercentage
            : state.scanPercentage,
      };

    case 'FILTERED_COUNT':
      return {
        ...state,
        filteredCount: action.payload,
      };

    // Filter out any events now outside desired range
    case 'FILTER_RANGE':
      return {
        ...state,
        blocks: state.blocks.filter(
          (blockNumber) =>
            blockNumber >= action.payload.startBlock &&
            blockNumber <= action.payload.endBlock
        ),
        events: state.events.filter(
          ({ blockNumber }) =>
            blockNumber >= action.payload.startBlock &&
            blockNumber <= action.payload.endBlock
        ),
      };

    case 'FILTER_NAMES':
      return {
        ...state,
        filters: action.payload,
      };

    case 'CLEAR':
      return {
        ...state,
        events: [],
        blocks: [],
      };

    case 'RESET':
      return {
        ...INIT_STATE,
        scanMode: state.scanMode,
      };

    case 'SCAN_MODE': {
      return {
        ...state,
        scanMode: action.payload,
        scanPercentage: 0,
        isFirstScanAttempt: true,
      };
    }

    case 'SCAN_START':
      return {
        ...state,
        isFirstScanAttempt: false,
        isScanning: true,
        scanPercentage: 0,
      };

    case 'SCAN_COMPLETE':
      return {
        ...state,
        isScanning: false,
      };

    default:
      throw new Error(`Unknown action type`);
  }
};
