import Product, { IProduct } from "../types/Product";
import { Box, Image, Heading, Text, Button, Link } from '@chakra-ui/react';
import { generateAmazonAffiliateLink } from "../util/links";
import StarRatings from 'react-star-ratings';

export default function ProductSm({ product }: { product: IProduct }) {
  const link = generateAmazonAffiliateLink(product.productKey)
  return (
    <Box mb='5'>
      <Box
        mb='3'
      >
        <Link
          href={link} target='blank'
          isExternal={true}
        >
          <Image
            src={product.imageUrl}
            loading='lazy'
            rounded='md'
            mb='3'
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

      <Text textDecoration='none'>${product.price}</Text>
    </Box>
  )
}