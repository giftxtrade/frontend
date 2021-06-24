import Product, { IProduct } from "../types/Product";
import { Box, Image, Heading, Text, Button, Link } from '@chakra-ui/react';
import { generateAmazonAffiliateLink } from "../util/links";
import StarRatings from 'react-star-ratings';
import numberToCurrency from "../util/currency";

export default function ProductSm({ product }: { product: IProduct }) {
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

      <Text textDecoration='none'>{price}</Text>
    </Box>
  )
}