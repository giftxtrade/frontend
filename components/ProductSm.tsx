import Product, { IProduct } from "../types/Product";
import { Box, Image, Heading, Text, Button, Link } from '@chakra-ui/react';
import { generateAmazonAffiliateLink } from "../util/links";

export default function ProductSm({ product }: { product: IProduct }) {
  const link = generateAmazonAffiliateLink(product.productKey)
  return (
    <Box mb='5'>
      <Link href={link} target='blank' isExternal={true}>
        <Image
          src={product.imageUrl}
          loading='lazy'
          rounded='md'
          mb='3'
        />
        <Heading size='sm' noOfLines={3} mb='2'>{product.title}</Heading>
      </Link>
      <Text textDecoration='none'>${product.price}</Text>
    </Box>
  )
}