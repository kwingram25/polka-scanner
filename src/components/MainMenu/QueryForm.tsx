import { Field, Formik, useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { number, object } from 'yup';

import {
  Box,
  Button,
  chakra,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper,
} from '@chakra-ui/react';

import { useApi, useEvents } from '../../contexts';
import { useIsMounted } from '../../hooks';

import { ModeControl } from './ModeControl';

const MAX_RANGE_SIZE = 100;

interface Values {
  startBlock: number | null;
  endBlock: number | null;
}

function BlockInput({
  accessory = null,
  field,
  isDisabled = false,
  label,
}: {
  accessory?: React.ReactNode | null;
  field: keyof Values;
  isDisabled?: NumberInputProps['isDisabled'];
  label: React.ReactNode;
}) {
  const { errors, setFieldValue } = useFormikContext<Values>();

  const onChange = useCallback(
    (value) => {
      setFieldValue(field, parseInt(value, 10));
    },
    [field, setFieldValue]
  );

  return (
    <FormControl
      data-cy={`input-${field}`}
      isInvalid={!!errors[field]}
      mb={4}
      mt={2}
    >
      <FormLabel fontSize="sm" htmlFor={field} textColor="gray.300">
        {label}
        {accessory && <Box float="right">{accessory}</Box>}
      </FormLabel>
      <Field
        as={NumberInput}
        id={field}
        isDisabled={isDisabled}
        name={field}
        onChange={onChange}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </Field>
      {errors[field] && <FormErrorMessage>{errors[field]}</FormErrorMessage>}
    </FormControl>
  );
}

BlockInput.defaultProps = {
  accessory: null,
  isDisabled: false,
};

function EndBlock() {
  const isMounted = useIsMounted();
  const { latestBlock } = useApi();
  const { setFieldValue } = useFormikContext<Values>();

  const [isUsingLatest, setIsUsingLatest] = useState(true);

  useEffect(() => {
    if (isUsingLatest && isMounted) {
      setFieldValue('endBlock', latestBlock);
    }
  }, [isUsingLatest, isMounted, latestBlock, setFieldValue]);

  useEffect((): void => {
    if (!isMounted) {
      setFieldValue('startBlock', latestBlock - 10);
      setFieldValue('endBlock', latestBlock);
    }
  }, [isMounted, latestBlock, setFieldValue]);

  return (
    <BlockInput
      accessory={
        isUsingLatest ? (
          <>
            Latest
            {' · '}
            <Link
              data-cy="use-manual"
              href="#"
              onClick={() => setIsUsingLatest(false)}
            >
              Use Manual
            </Link>
          </>
        ) : (
          <Link
            data-cy="use-latest"
            href="#"
            onClick={() => setIsUsingLatest(true)}
          >
            Use Latest
          </Link>
        )
      }
      field="endBlock"
      isDisabled={isUsingLatest}
      label="End Block"
      // validate={validate}
    />
  );
}

function StartBlock() {
  return <BlockInput field="startBlock" label="Start Block" />;
}

function ValidateSync() {
  const { validateForm, values } = useFormikContext();

  useEffect((): void => {
    validateForm(values);
  }, [validateForm, values]);
  return null;
}

export function QueryForm() {
  const { latestBlock } = useApi();
  const { isScanning, scanMode, scanEventsInRange, scanEventsLive } =
    useEvents();

  useEffect(() => {
    if (scanMode === 'live') {
      scanEventsLive();
    }
  }, [scanMode, scanEventsLive]);

  return (
    <Formik<Values>
      initialValues={{
        startBlock: latestBlock - 10,
        endBlock: latestBlock,
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        endBlock: number()
          .moreThan(0, 'Cannot be zero or negative')
          .test({
            name: 'greaterThanStart',
            exclusive: false,
            message: `Cannot be less than specified start block`,
            test: (value, ctx) => value >= ctx.parent.startBlock,
          })
          .test({
            name: 'range',
            exclusive: false,
            message: `Cannot query more than ${MAX_RANGE_SIZE} blocks`,
            test: (value, ctx) =>
              value <= ctx.parent.startBlock + MAX_RANGE_SIZE,
          }),

        startBlock: number()
          .moreThan(0, 'Cannot be zero or negative')
          .test({
            name: 'lessThanEnd',
            exclusive: false,
            message: `Cannot be greater than specified end block`,
            test: (value, ctx) => value <= ctx.parent.endBlock,
          })
          .test({
            name: 'range',
            exclusive: false,
            message: `Cannot query more than ${MAX_RANGE_SIZE} blocks`,
            test: (value, ctx) => value >= ctx.parent.endBlock - MAX_RANGE_SIZE,
          }),
      })}
      onSubmit={({ startBlock, endBlock }) => {
        scanEventsInRange(startBlock, endBlock);
      }}
    >
      {({ handleSubmit, isValid }) => (
        <chakra.form onSubmit={handleSubmit}>
          <ValidateSync />
          <ModeControl />
          {scanMode === 'query' && (
            <Box p={4}>
              <StartBlock />
              <EndBlock />
              <Button
                _hover={{
                  bg: 'pink.700',
                }}
                bg="pink.800"
                data-cy="scan-button"
                isDisabled={!isValid}
                isLoading={isScanning}
                loadingText="Scanning..."
                mt={6}
                type="submit"
                variant="solid"
                w="100%"
              >
                Scan
              </Button>
            </Box>
          )}
        </chakra.form>
      )}
    </Formik>
  );
}
