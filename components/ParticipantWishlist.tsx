import {
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Stack,
  Checkbox,
  Container,
  useToast
} from '@chakra-ui/react';
import { WishlistProductItem } from './WishlistItem';
import { IWish } from '../types/Wish';
import { useState } from 'react';
import { IProduct } from '../types/Product';
import numberToCurrency from '../util/currency';
import styles from '../styles/ParticipantWishlist.module.css'
import { content } from '../util/content';

export interface IParticipantWishlistProps {
  name: string | undefined
  wishlist: Array<IWish>
  isMyDraw: boolean
}

export default function ParticipantWishlist({ name, wishlist, isMyDraw }: IParticipantWishlistProps) {
  const [myDraw, setMyDraw] = useState(isMyDraw)
  const [selectedProducts, setSelectedProducts] = useState(Array<IProduct>())

  let sNameFormatted = ''
  if (name) {
    const sName = name.split(' ')[0]
    sNameFormatted = sName && sName[sName.length - 1] === 's' ? `${sName}'` : `${sName}'s`
  }

  const toast = useToast()

  const buildAddToCartUrl = (accessKey: string, associatesTag: string) => {
    // https://webservices.amazon.com/paapi5/documentation/add-to-cart-form.html
    const amzBase = 'https://www.amazon.com/gp/aws/cart/add.html'
    let urlWithParam = amzBase + `?AWSAccessKeyId=${accessKey}`
    urlWithParam = urlWithParam + `&AssociateTag=${associatesTag}`
    selectedProducts.map(p => p.productKey).forEach((key, i) => {
      urlWithParam += `&ASIN.${i + 1}=${key}&Quantity.${i + 1}=1`
    })
    return urlWithParam
  }

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

            <Stack spacing='4' direction='row' justify='space-between' alignItems='center'>
              <Stack spacing='4' direction='row'>
                <Text fontWeight='bold'>Total</Text>
                <Text>
                  {selectedProducts.length === 0 ?
                    numberToCurrency(0.0) :
                    numberToCurrency(selectedProducts.map(p => p.price).reduce((prev, cur) => prev + cur))
                  }
                </Text>
              </Stack>

              <Button
                disabled={selectedProducts.length === 0}
                colorScheme='blue'
                size='sm'
                onClick={() => {
                  const cartUrl = buildAddToCartUrl('randomkey', content.ASSOCIATE_TAG)
                  const newWindow = window.open(cartUrl, '_blank')
                }}
              >
                Add to Cart
              </Button>
            </Stack>
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
                  <Flex direction='row'>
                    <Checkbox
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product])
                        } else {
                          setSelectedProducts([...selectedProducts.filter(p => p.id !== product.id)])
                        }
                      }}
                      flex='1'
                      pr='5'
                      ml='1'
                    />

                    <Box flex='100'>
                      <WishlistProductItem
                        product={product}
                        removeWish={null}
                      />
                    </Box>
                  </Flex>
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