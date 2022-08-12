import { Button, ButtonGroup, CircularProgress } from '@chakra-ui/react';

import { useEvents } from '../../contexts';
import { ScanMode } from '../../types';

interface ModeButtonProps extends React.HTMLProps<HTMLButtonElement> {
  mode: ScanMode;
}

function ModeButton({ children, mode }: ModeButtonProps) {
  const { isScanning, scanMode, setScanMode } = useEvents();

  return (
    <Button
      borderBottomRadius={scanMode === 'query' ? 'none' : 'md'}
      cursor="pointer"
      flex={1}
      isDisabled={mode === 'live' && isScanning}
      size="sm"
      textTransform="uppercase"
      onClick={() => setScanMode(mode)}
      {...(scanMode === mode
        ? {
            bg: 'pink.800',
            color: 'white',
            borderColor: 'pink.800',
            _hover: {
              bg: 'pink.700',
            },
          }
        : {})}
    >
      {children}
    </Button>
  );
}

export function ModeControl() {
  const { scanMode } = useEvents();

  return (
    <ButtonGroup data-cy="mode-control" isAttached w="full">
      <ModeButton mode="live">
        Live
        {scanMode === 'live' && (
          <CircularProgress
            color="white"
            isIndeterminate
            ml={2}
            size="14px"
            trackColor="transparent"
          />
        )}
      </ModeButton>
      <ModeButton mode="query">Query</ModeButton>
    </ButtonGroup>
  );
}
