import {
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Stack,
} from '@chakra-ui/react';
import { WishlistProductItem } from './WishlistItem';
import { IWish } from '../types/Wish';
import { useState } from 'react';

export interface IParticipantWishlistProps {
  name: string | undefined
  wishlist: Array<IWish>
  isMyDraw: boolean
}

export default function ParticipantWishlist({ name, wishlist, isMyDraw }: IParticipantWishlistProps) {
  const [myDraw, setMyDraw] = useState(isMyDraw)

  return (
    <Box
      flex='1'
      maxW='lg'
      ml='auto' mr='auto'
    >
      <Heading size='sm' mb='5'>
        {name && name[name.length - 1] === 's' ? `${name}'` : `${name}'s`} Wishlist
      </Heading>

      {wishlist.length === 0 ? (
        <Text textAlign='center' color='gray.400'>Wishlist is empty</Text>
      ) : (
        wishlist.map(({ product }, i) => (
          <Box mb='5' key={`wishitem#${i}`}>
            <WishlistProductItem
              product={product}
              removeWish={null}
            />
          </Box>
        ))
      )}
    </Box>
  )
}