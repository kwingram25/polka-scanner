import React, { useEffect, useMemo } from 'react';
import FlipMove from 'react-flip-move';

import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  chakra,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { useEvents } from '../../contexts';
import { useIsMobileView } from '../../hooks';
import type { EventRow } from '../../types';

import {
  BlockNumberCell,
  DataCell,
  EventNameCell,
  ExpanderCell,
} from './cells';
import { EmptyTableView } from './EmptyTableView';
import { EventData } from './EventData';
import { SCAN_PROGRESS_HEIGHT, ScanProgress } from './ScanProgress';

const widths = {
  blockNumber: '10rem',
  expander: '1rem',
  eventName: '18rem',
};

function multiSelectFilter(
  row: Row<EventRow>,
  columnId: string,
  filterValue: string[]
) {
  return (
    filterValue.length === 0 ||
    filterValue.includes(row.getValue(columnId) as string)
  );
}

export function EventTable() {
  const isMobile = useIsMobileView();
  const { events, filters, setFilteredCount } = useEvents();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    { desc: true, id: 'blockNumber' },
  ]);

  // ColumnDef<EventRow> instantiation causes TypeScript to break
  const columns: ColumnDef<EventRow>[] = useMemo(
    () => [
      {
        id: 'expander',
        header: () => null,
        cell: ExpanderCell,
      },
      {
        accessorFn: (info) => (info as EventRow).blockNumber,
        id: 'blockNumber',
        header: 'Block',
        cell: BlockNumberCell,
      },
      {
        accessorFn: (info) => {
          const { record } = info as EventRow;

          return `${record.event.section}.${record.event.method}`;
        },
        header: 'Event',
        id: 'eventName',
        cell: EventNameCell,
        filterFn: multiSelectFilter,
      },
      ...(isMobile
        ? []
        : [
            {
              accessorFn: ({ record }) => record.event.data.toString(),
              header: 'Data',
              id: 'data',
              enableSorting: false,
              cell: DataCell,
            },
          ]),
    ],
    [isMobile]
  );

  const table = useReactTable({
    columns,
    data: Object.values(events),
    filterFns: {
      multiSelectFilter,
    },
    state: { columnFilters, sorting },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand: () => true,
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect((): void => {
    if (filters.length > 0) {
      setColumnFilters([{ id: 'eventName', value: filters }]);
    } else {
      setColumnFilters([]);
    }
  }, [filters]);

  useEffect((): void => {
    if (columnFilters.length > 0) {
      setFilteredCount(
        events.length - table.getPrePaginationRowModel().rows.length
      );
    }
  }, [events, columnFilters, setFilteredCount, table]);

  return (
    <Flex
      alignItems="center"
      data-cy="table-container"
      flexDirection="column"
      height="100%"
      position="relative"
    >
      <ScanProgress />
      <Table maxWidth="100%" position="relative" sx={{}}>
        <Thead zIndex="200">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr bg="gray.900" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  _hover={{
                    textColor: 'white',
                  }}
                  bg="gray.900"
                  cursor="pointer"
                  display={{
                    base: header.id === 'data' ? 'none' : 'table-cell',
                    lg: 'table-cell',
                  }}
                  key={header.id}
                  position="sticky"
                  top={SCAN_PROGRESS_HEIGHT}
                  transition="0.2s color"
                  whiteSpace="nowrap"
                  width={isMobile ? undefined : widths[header.id]}
                  zIndex={2}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <Box zIndex={300}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <chakra.span pl="2">
                      {{
                        asc: <TriangleUpIcon aria-label="sorted ascending" />,
                        desc: (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ),
                      }[header.column.getIsSorted() as string] ?? null}
                    </chakra.span>
                  </Box>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <FlipMove enterAnimation="fade" leaveAnimation="fade" typeName={null}>
          {table.getRowModel().rows.map((row) => {
            const isExpanded = row.getIsExpanded();

            return (
              <Tbody
                key={row.id}
                {...(isExpanded ? { bg: 'pink.900' } : {})}
                _hover={{
                  bgColor: isExpanded ? 'pink.800' : 'pink.900',
                }}
                transition="0.2s background-color"
              >
                <Tr
                  cursor={isExpanded ? 'auto' : 'pointer'}
                  onClick={
                    isExpanded ? undefined : row.getToggleExpandedHandler()
                  }
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <React.Fragment key={`cell-${index}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </React.Fragment>
                  ))}
                </Tr>
                {isMobile && isExpanded && (
                  <Tr transition="0.2s background-color">
                    <Td
                      colSpan={row.getVisibleCells().length}
                      maxWidth="0"
                      overflowX="hidden"
                      textOverflow="ellipsis"
                    >
                      <EventData
                        event={(row.original as EventRow).record.event}
                        withDocs
                      />
                    </Td>
                  </Tr>
                )}
              </Tbody>
            );
          })}
        </FlipMove>
      </Table>
      {table.getRowModel().rows.length === 0 && <EmptyTableView />}
    </Flex>
  );
}
