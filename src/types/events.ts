import { EventRecord } from './substrate';

export interface EventRow {
  blockNumber: number;
  record: EventRecord;
}

export type ScanMode = 'live' | 'query';

export type EventsAction =
  | {
      type: 'ADD';
      payload: {
        blockNumber: number;
        newEvents: EventRecord[];
        scanMode: ScanMode;
        scanPercentage?: number;
      };
    }
  | { type: 'FILTER_RANGE'; payload: { startBlock: number; endBlock: number } }
  | { type: 'FILTER_NAMES'; payload: string[] }
  | { type: 'FILTERED_COUNT'; payload: number }
  | { type: 'CLEAR' }
  | { type: 'RESET' }
  | { type: 'SCAN_START' }
  | { type: 'SCAN_COMPLETE' }
  | { type: 'SCAN_MODE'; payload: 'live' | 'query' };

export interface EventsState {
  events: EventRow[];
  filters: string[];
  filteredCount: number;
  blocks: number[];
  methods: string[];
  isFirstScanAttempt: boolean;
  isScanning: boolean;
  scanMode: ScanMode;
  scanPercentage: number;
}
