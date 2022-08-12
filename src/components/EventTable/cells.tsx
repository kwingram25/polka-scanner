import { TriangleDownIcon } from '@chakra-ui/icons';
import { Box, Button, TableCellProps, Td } from '@chakra-ui/react';
import { CellContext } from '@tanstack/react-table';

import { useIsMobileView } from '../../hooks';
import { EventRow } from '../../types';

import { EventData } from './EventData';
import { EventDocs } from './EventDocs';

function BaseCell({
  children,
  row,
  ...props
}: { row: CellContext<EventRow, unknown>['row'] } & TableCellProps) {
  const isMobile = useIsMobileView();

  return (
    <Td
      borderBottomWidth={row.getIsExpanded() && isMobile ? '0' : '1px'}
      valign="top"
      {...props}
    >
      {children}
    </Td>
  );
}

export function ExpanderCell(cell: CellContext<EventRow, unknown>) {
  const { row } = cell;
  const isExpanded = row.getIsExpanded();

  return (
    <BaseCell px={2} row={row}>
      <Button
        aria-label="expand"
        h={6}
        transform={isExpanded ? 'none' : 'rotate(-90deg)'}
        transition="0.1s transform"
        variant="unstyled"
        onClick={isExpanded ? row.getToggleExpandedHandler() : undefined}
      >
        <TriangleDownIcon />
      </Button>
    </BaseCell>
  );
}

export function BlockNumberCell(cell: CellContext<EventRow, unknown>) {
  const { getValue, row } = cell;

  return (
    <BaseCell row={row}>
      <Box fontFamily="monospace" fontSize="md" textColor="pink.300">
        #{getValue().toLocaleString()}
      </Box>
    </BaseCell>
  );
}

export function EventNameCell(cell: CellContext<EventRow, unknown>) {
  const isMobile = useIsMobileView();
  const { getValue, row } = cell;

  return (
    <BaseCell maxW="16rem" row={row}>
      <Box
        fontFamily="monospace"
        fontSize="md"
        overflowX="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {getValue()}
      </Box>
      {row.getIsExpanded() && !isMobile && (
        <EventDocs event={row.original.record.event} />
      )}
    </BaseCell>
  );
}

export function DataCell({ row, getValue }: CellContext<EventRow, unknown>) {
  const isMobile = useIsMobileView();

  return (
    <Td
      display={{ base: isMobile ? 'table-cell' : 'none', lg: 'table-cell' }}
      maxWidth="0"
      overflowX="hidden"
      valign="top"
      whiteSpace="nowrap"
    >
      {row.getIsExpanded() ? (
        <>
          {isMobile && <EventDocs event={row.original.record.event} />}
          <EventData event={row.original.record.event} />
        </>
      ) : (
        <Box
          fontFamily="monospace"
          fontSize="sm"
          overflow="hidden"
          textColor="gray.400"
          textOverflow="ellipsis"
        >
          {getValue()}
        </Box>
      )}
    </Td>
  );
}
