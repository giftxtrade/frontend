import {
  Text,
  Flex,
  Link,
  Box,
  Image,
  Button,
  Stack
} from '@chakra-ui/react'
import { IProduct } from '../types/Product';
import { generateAmazonAffiliateLink } from '../util/links';
import numberToCurrency from '../util/currency';
import StarRatings from 'react-star-ratings';

export function WishlistLoadingItem() {
  return (
    <Flex maxW='full' h='80px' direction='row' alignItems='flex-start' justifyContent='flex-start'>
      <Box maxW='full' h='80px' flex='1' bg='gray.200' rounded='md'></Box>
      <Box maxW='full' h='80px' flex='2' ml='2'>
        <Box h='20px' bg='gray.200' rounded='md' mb='2'></Box>

        <Box h='10px' bg='gray.200' rounded='md' mb='2'></Box>
        <Box maxW='60%' h='10px' bg='gray.200' rounded='md'></Box>
      </Box>
    </Flex>
  )
}

export interface IWishlistProductProps {
  product: IProduct
  removeWish: ((product: IProduct) => void) | null
}

export function WishlistProductItem({ product, removeWish }: IWishlistProductProps) {
  const link = generateAmazonAffiliateLink(product.productKey)

  return (
    <Flex maxW='full' direction='row' alignItems='flex-start' justifyContent='flex-start'>
      <Box flex='1' maxH='100px' overflow='hidden' rounded='md'>
        <Link href={link} isExternal={true}>
          <Image src={product.imageUrl} />
        </Link>
      </Box>
      <Box flex='2' ml='2'>
        <Text noOfLines={2} size='xs' mb='1'>
          <Link href={link} isExternal={true}>{product.title}</Link>
        </Text>

        <StarRatings
          rating={product.rating}
          starDimension="13px"
          starSpacing="0.5px"
          starRatedColor="rgb(255, 188, 0)"
        />

        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
        >
          <Text fontSize='sm' fontWeight='bold'>
            {numberToCurrency(product.price)}
          </Text>

          {removeWish ? (
            <Button
              float='right'
              colorScheme='red'
              size='xs'
              onClick={() => removeWish(product)}
            >
              Remove
            </Button>
          ) : <></>}
        </Stack>
      </Box>
    </Flex>
  )
}