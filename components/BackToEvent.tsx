import NextLink from 'next/link';
import { BsChevronLeft } from 'react-icons/bs';
import {
  Button,
  Box,
  Link,
  Icon
} from '@chakra-ui/react';
import { useState } from 'react';

export default function BackToEvent({ eventId }: { eventId: number }) {
  const [loading, setLoading] = useState(false)

  return (
    <Box mb='5'>
      <NextLink href={`/events/${eventId}`} passHref>
        <Link>
          <Button
            leftIcon={<Icon as={BsChevronLeft} />}
            size='sm'
            isLoading={loading}
            onClick={() => setLoading(true)}
          >
            Back to Event
          </Button>
        </Link>
      </NextLink>
    </Box>
  )
}