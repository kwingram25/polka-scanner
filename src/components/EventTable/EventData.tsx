import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import { Identicon } from '@polkadot/react-identicon';
import { encodeTypeDef } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

import { useApi } from '../../contexts';
import { Codec, Event } from '../../types';

import { EventDocs } from './EventDocs';

interface Props {
  event: Event;
  withDocs?: boolean;
}

// Display and format accounts and balances nicely
// TODO: Format all possible chain types - struct, enum, etc
function ArgView({ arg, type }: { arg: Codec; type: string }) {
  const toast = useToast();
  const {
    chainProperties: { tokenDecimals, tokenSymbol },
  } = useApi();
  switch (type) {
    case 'AccountId32':
    case 'AccountId':
      return (
        <Flex
          alignItems="center"
          overflowX="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          <Identicon
            onCopy={() =>
              toast({
                title: 'Address copied to clipboard',
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
            }
            size={32}
            style={{ backgroundColor: 'white', borderRadius: '32px' }}
            value={arg.toString()}
          />
          <Box ml={2} overflowX="hidden" textOverflow="ellipsis">
            {arg.toString()}
          </Box>
        </Flex>
      );

    // Imperfect, u128s can also be non-balances
    case 'u128':
    case 'Balance':
      return (
        <>
          {formatBalance(arg.toString(), {
            decimals: tokenDecimals,
            withUnit: tokenSymbol,
          })}
        </>
      );

    default:
      return (
        <Text
          fontFamily="monospace"
          fontSize="md"
          overflowX="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {arg.toString()}
        </Text>
      );
  }
}

export function EventData({ event, withDocs }: Props) {
  const { api } = useApi();
  const args = event.data.map((arg) => arg);
  const {
    data: { names, typeDef: types },
  } = event;

  const isNamedArgs = Array.isArray(names);

  if (!api?.registry) {
    return null;
  }

  return (
    <>
      {withDocs && <EventDocs event={event} mb={4} />}
      {args.map((arg, index) => {
        const type = encodeTypeDef(api.registry, types[index]);
        return (
          <Box _last={{ mb: 0 }} key={`arg-${index}`} mb={4}>
            <Box fontFamily="monospace" fontSize="" textColor="gray.300">
              {isNamedArgs && `${names[index]}: `}
              {type}
            </Box>
            <Box ml={3} overflowX="hidden" p={2} textOverflow="ellipsis">
              <ArgView arg={arg} type={type} />
            </Box>
          </Box>
        );
      })}
    </>
  );
}

EventData.defaultProps = {
  withDocs: false,
};
