import {
  Container,
  Heading,
  Text,
  Button,
  Icon,
  Flex,
  Stack,
  Link,
  Box
} from '@chakra-ui/react'
import { IEvent } from '../types/Event'
import { BsPlusCircle } from 'react-icons/bs';
import NextLink from 'next/link';

export interface IMyWishlistProps {
  event: IEvent
}

export default function MyWishlist({ event }: any) {
  return (
    <Container
      flex='1'
      pl='2'
      pr='0'
    >
      <Flex mb='5' direction='row' alignItems='center' justifyContent='start'>
        <Heading size='md' m='0' p='0' mt='1.5'>My Wishlist</Heading>

        <NextLink href={`/events/${event.id}/wishlist`} passHref>
          <Link>
            <Button
              size='md'
              p='0'
              ml='5'
              variant="ghost"
              colorScheme='blue'
              spacing='sm'
              title='Add more items to wishlist'
            >
              <Icon as={BsPlusCircle} boxSize='1.5em' />
            </Button>
          </Link>
        </NextLink>
      </Flex>

      {[1, 2, 3, 4, 5].map((p, i) => (
        <Box maxW='full' h='60px' bg='gray.200' mb='5' rounded='md'></Box>
      ))}
    </Container>
  )
}