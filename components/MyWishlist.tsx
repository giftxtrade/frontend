import {
  Container,
  Heading,
  Text,
  Button,
  Icon,
  Flex,
  Link,
  Box,
} from '@chakra-ui/react'
import { IEvent } from '../types/Event'
import { BsPlusCircle } from 'react-icons/bs';
import NextLink from 'next/link';
import { IWish } from '../types/Wish';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../util/api';
import { unstable_batchedUpdates } from 'react-dom';
import { WishlistLoadingItem, WishlistProductItem } from './WishlistItem';

export interface IMyWishlistProps {
  event: IEvent,
  accessToken: string
}

export default function MyWishlist({ event, accessToken }: IMyWishlistProps) {
  const [wishes, setWishes] = useState(Array<IWish>())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${api.wishes}/${event.id}`, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }: { data: IWish[] }) => {
        unstable_batchedUpdates(() => {
          setWishes(data)
          setLoading(false)
        })
      })
      .catch()
  }, [])

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

      {
        loading ? [1, 2].map((p, i) => (
          <Box mb='5' key={`loading#${i}`}>
            <WishlistLoadingItem />
          </Box>
        )) : (
          wishes.length === 0 ? (
            <Text textAlign='center' color='gray.400'>Your wishlist is empty. Click the "+" button to add products</Text>
          ) : (
            wishes.map(({ product }, i) => (
              <Box mb='10' key={`wishitem#${i}`}>
                <WishlistProductItem product={product} />
              </Box>
            ))
          )
        )
      }
    </Container>
  )
}