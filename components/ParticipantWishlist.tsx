import {
  Heading,
  Text,
  Box,
  useToast
} from '@chakra-ui/react';
import { WishlistProductItem } from './WishlistItem';
import { IWish } from '../types/Wish';
import { useState } from 'react';
import { IProduct } from '../types/Product';
import styles from '../styles/ParticipantWishlist.module.css'
import WishlistItemSelect from './WishlistItemSelect';
import WishlistTotal from './WishlistTotal';
import { Wish } from "@giftxtrade/api-types"

export interface IParticipantWishlistProps {
  name: string | undefined
  wishlist: Wish[]
  isMyDraw: boolean
}

export default function ParticipantWishlist({ name, wishlist, isMyDraw }: IParticipantWishlistProps) {
  const [selectedProducts, setSelectedProducts] = useState(Array<IProduct>())

  let sNameFormatted = ''
  if (name) {
    const sName = name.split(' ')[0]
    sNameFormatted = sName && sName[sName.length - 1] === 's' ? `${sName}'` : `${sName}'s`
  }

  const toast = useToast()

  return (
    <>
      <Box
        flex='1'
        maxW='lg'
        ml='auto' mr='auto'
        position='relative'
      >
        {isMyDraw ? (
          <Box
            pt='5' pb='3' pl='4' pr='4'
            position='sticky' top='0'
            bg='white'
            zIndex='2'
            className={styles.cartReveal}
          >
            <Heading size='md' mb='3' color='gray.700'>
              {sNameFormatted} Wishlist
            </Heading>

            <WishlistTotal
              selectedProducts={selectedProducts}
              showAddToCart={true}
            />
          </Box>
        ) : (
          <Heading size='md' mb='5' color='gray.700'>
            {sNameFormatted} Wishlist
          </Heading>
        )}

        <Box mt='4' overflowX='hidden'>
          {wishlist.length === 0 ? (
            <Text textAlign='center' color='gray.400'>Wishlist is empty</Text>
          ) : (
            wishlist.map(({ product }, i) => (
              <Box mb='5' key={`wishitem#${i}`}>
                {isMyDraw ? (
                  <WishlistItemSelect
                    selectedProducts={selectedProducts}
                    product={product}
                    setSelectedProducts={setSelectedProducts}
                    removeWish={null}
                  />
                ) : (
                    <WishlistProductItem
                      product={product}
                      removeWish={null}
                    />
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  )
}