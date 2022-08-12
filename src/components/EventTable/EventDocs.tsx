import ReactMarkdown from 'react-markdown';

import { Box, BoxProps } from '@chakra-ui/react';

import { Event } from '../../types';

interface Props extends BoxProps {
  event: Event;
}

export function EventDocs({ event, ...boxProps }: Props) {
  return (
    <Box fontSize="sm" mt="1" {...boxProps}>
      <ReactMarkdown>{event.meta.docs.join('\r\n')}</ReactMarkdown>
    </Box>
  );
}
