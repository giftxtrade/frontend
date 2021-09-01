import Product, { IProduct } from "../types/Product";
import { Box, Image, Heading, Text, Button, Link, Icon, Stack } from '@chakra-ui/react';
import { generateAmazonAffiliateLink } from "../util/links";
import StarRatings from 'react-star-ratings';
import numberToCurrency from "../util/currency";
import { IoMdAddCircle } from 'react-icons/io'
import styles from '../styles/ProductSm.module.css'

export interface IProductSmProps {
  product: IProduct,
  productSet: Set<number>

  addWish: (product: IProduct) => void
  removeWish: (product: IProduct) => void
}

export default function ProductSm({ product, productSet, addWish, removeWish }: IProductSmProps) {
  const link = generateAmazonAffiliateLink(product.productKey)
  const price = numberToCurrency(product.price)

  return (
    <Box mb='10' id={`product#${product.id}`} pl='2' pr='2'>
      <Box overflow='hidden'>
        <Link
          href={link} target='blank'
          isExternal={true}
        >
          <Box
            className={`${styles.productImgContainer} skeletonLoading`}
            rounded='md'
            mb='3'
          >
            <Image
              src={product.imageUrl}
              loading='lazy'
              rounded='md'
              className={`${styles.productImg} skeletonLoading`}
            />
          </Box>

          <Heading
            size='sm'
            noOfLines={3}
            title={product.title}
            maxH='57.6px'
            overflow='hidden'
          >
            {product.title}
          </Heading>
        </Link>

        <StarRatings
          rating={product.rating}
          starDimension="15px"
          starSpacing="1px"
          starRatedColor="rgb(255, 188, 0)"
        />
      </Box>

      <Stack
        textDecoration='none'
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Text>
          {price}
        </Text>

        <Button
          variant='ghost'
          colorScheme='blue'
          onClick={() => addWish(product)}
          isDisabled={productSet.has(product.id)}
          leftIcon={<Icon as={IoMdAddCircle} />}
        >
          Add
        </Button>
      </Stack>
    </Box>
  )
}