import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  chakra,
  CircularProgress,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
} from '@chakra-ui/react';
import { WsProvider } from '@polkadot/api';
import { VoidFn } from '@polkadot/api/types';

import { WELL_KNOWN_ENDPOINTS } from '../../constants';
import { useApi, useEvents } from '../../contexts';
import { useIsMounted } from '../../hooks';

const WS_REGEX = /^wss?:\/\//;

interface Props {
  isOpen: ModalProps['isOpen'];
  onClose: ModalProps['onClose'];
}

function ChainButton({
  name,
  onClick,
  url,
}: {
  name: string;
  onClick: VoidFn;
  url: string;
}) {
  return (
    <Button
      _hover={{ bg: 'gray.700' }}
      alignItems="center"
      bg="gray.800"
      d="flex"
      fontWeight="normal"
      p={2}
      rounded="none"
      textAlign="left"
      variant="unstyled"
      w="100%"
      onClick={onClick}
    >
      <Box flex={1}>{name}</Box>
      <chakra.span
        fontFamily="monospace"
        fontSize="xs"
        maxW="70%"
        overflowX="hidden"
        textColor="gray.400"
        textOverflow="ellipsis"
      >
        {url}
      </chakra.span>
    </Button>
  );
}

export function RpcModal({ isOpen, onClose }: Props) {
  const isMounted = useIsMounted();
  const { endpoint, recentlyUsed, setEndpoint } = useApi();
  const { resetEvents } = useEvents();
  const [newEndpoint, setNewEndpoint] = useState(endpoint);
  const [dbNewEndpoint] = useDebounce(newEndpoint, 400);
  const [isChecking, setIsChecking] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const isTouched = dbNewEndpoint !== endpoint;

  useEffect((): void => {
    async function testWs() {
      setIsChecking(true);

      const ws = new WsProvider(dbNewEndpoint, false, {}, 5000);

      ws.on('error', () => {
        setIsValid(false);
        setIsChecking(false);
      });

      await ws.connect();

      await ws.isReady;

      setIsValid(true);
      setIsChecking(false);

      ws.disconnect();
    }

    if (isMounted && isTouched) {
      if (!WS_REGEX.test(dbNewEndpoint)) {
        setIsValid(false);
        setIsChecking(false);

        return;
      }

      try {
        testWs();
      } catch (e) {
        setIsValid(false);
        setIsChecking(false);
      }
    }
  }, [dbNewEndpoint, endpoint, isMounted, isTouched]);

  useEffect(() => {
    if (!isOpen) {
      setNewEndpoint(endpoint);
    }
  }, [endpoint, isOpen]);

  const onSubmit = useCallback(
    (submittedValue) => {
      resetEvents();
      setEndpoint(submittedValue);

      onClose();
    },
    [onClose, resetEvents, setEndpoint]
  );

  const inputAccessory = useMemo(() => {
    if (isChecking) {
      return (
        <CircularProgress
          color="yellow.500"
          isIndeterminate
          size="14px"
          trackColor="transparent"
        />
      );
    }

    if (isTouched) {
      return isValid ? (
        <Button
          _hover={{
            bgColor: 'green.600',
          }}
          aria-label="Confirm"
          bgColor="green.700"
          fontSize="xs"
          h="autp"
          isDisabled={!isValid}
          p={1}
          textTransform="uppercase"
          type="submit"
          variant="unstyled"
        >
          Switch
        </Button>
      ) : (
        <CloseIcon color="red.500" />
      );
    }

    return null;
  }, [isChecking, isTouched, isValid]);

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="gray.900" data-cy="rpc-modal">
        <ModalHeader>Set RPC Endpoint</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <chakra.form
            data-cy="rpc-endpoint-form"
            mb={6}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(dbNewEndpoint);
            }}
          >
            <FormControl isInvalid={!isValid && isTouched}>
              <InputGroup size="sm">
                <Input
                  autoFocus
                  borderColor="gray.500"
                  borderWidth={0}
                  fontFamily="monospace"
                  px={2}
                  py={0}
                  value={newEndpoint}
                  variant="flushed"
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  onFocus={(e) => {
                    if (WS_REGEX.test(e.target.value)) {
                      e.target.setSelectionRange(6, e.target.value.length);
                      return;
                    }

                    e.target.select();
                  }}
                  onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                    const pasteText = e.clipboardData.getData('text');

                    if (
                      WS_REGEX.test(pasteText) &&
                      WS_REGEX.test(e.currentTarget.value) &&
                      e.currentTarget.selectionStart === 6
                    ) {
                      e.preventDefault();
                      e.stopPropagation();

                      const pasteResult = `${e.currentTarget.value.slice(
                        0,
                        e.currentTarget.selectionStart
                      )}${e.clipboardData.getData(
                        'text'
                      )}${e.currentTarget.value.slice(
                        e.currentTarget.selectionEnd
                      )}`;

                      setNewEndpoint(
                        pasteResult.replace(/^(wss:\/\/)+/, 'wss://')
                      );
                    }
                  }}
                />
                <InputRightElement justifyContent="flex-end" w="4rem">
                  {inputAccessory}
                </InputRightElement>
              </InputGroup>
              <FormHelperText>
                {!isTouched && <>Enter an RPC WebSocket URL</>}
                {isChecking && <>Testing RPC endpoint...</>}
                {!isValid && !isChecking && isTouched && (
                  <>Invalid RPC endpoint</>
                )}
                {isValid && !isChecking && isTouched && (
                  <>Valid RPC endpoint found!</>
                )}
              </FormHelperText>
            </FormControl>
          </chakra.form>
          <Text fontSize="md" fontWeight="semibold" mb={3}>
            Well-Known Chains
          </Text>
          <List mb={3}>
            {WELL_KNOWN_ENDPOINTS.map(({ url, name }) => (
              <ListItem
                _last={{
                  borderBottomWidth: 0,
                }}
                borderBottomWidth={1}
                key={url}
              >
                <ChainButton
                  name={name}
                  url={url}
                  onClick={() => {
                    onSubmit(url);
                  }}
                />
              </ListItem>
            ))}
          </List>
          {recentlyUsed.length > 0 && (
            <>
              <Text fontSize="md" fontWeight="semibold" mb={3} mt={6}>
                Recently Used
              </Text>
              <List mb={3}>
                {recentlyUsed.map(({ url, name }) => (
                  <ListItem key={url}>
                    <ChainButton
                      name={name}
                      url={url}
                      onClick={() => {
                        onSubmit(url);
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
