import Product, { IProduct } from "../types/Product";
import { Box, Image, Heading, Text, Button, Link, Icon } from '@chakra-ui/react';
import { generateAmazonAffiliateLink } from "../util/links";
import StarRatings from 'react-star-ratings';
import numberToCurrency from "../util/currency";
import { FaCartPlus } from 'react-icons/fa'

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
    <Box mb='10' id={`product#${product.id}`}>
      <Box>
        <Link
          href={link} target='blank'
          isExternal={true}
        >
          <Image
            src={product.imageUrl}
            loading='lazy'
            rounded='md'
            mb='3'
            maxW='155px'
          />
          <Heading
            size='sm'
            noOfLines={3}
            title={product.title}
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

      <Text textDecoration='none'>
        {price}

        <Button
          ml='2'
          variant='ghost'
          colorScheme='blue'
          onClick={() => addWish(product)}
          isDisabled={productSet.has(product.id)}
        >
          <Icon as={FaCartPlus} />
        </Button>
      </Text>
    </Box>
  )
}