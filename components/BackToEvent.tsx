import NextLink from 'next/link';
import { BsChevronLeft } from 'react-icons/bs';
import {
  Button,
  Box,
  Link,
  Icon
} from '@chakra-ui/react';

export default function BackToEvent({ eventId }: { eventId: number }) {
  return (
    <Box mb='5'>
      <NextLink href={`/events/${eventId}`} passHref>
        <Link>
          <Button
            leftIcon={<Icon as={BsChevronLeft} />}
            size='sm'
          >
            Back to Event
          </Button>
        </Link>
      </NextLink>
    </Box>
  )
}