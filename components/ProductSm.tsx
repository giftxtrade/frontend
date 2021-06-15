import Product, { IProduct } from "../types/Product";
import { Box, Image, Heading, Text, Button, Link } from '@chakra-ui/react';
import { generateAmazonAffiliateLink } from "../util/links";

export default function ProductSm({ product }: { product: IProduct }) {
  return (
    <Box mb='5'>
      <Image
        src={product.imageUrl}
        loading='lazy'
        rounded='md'
        mb='3'
      />
      <Heading size='sm' noOfLines={3} mb='2'>{product.title}</Heading>
      <Text>${product.price}</Text>
      <Link href={generateAmazonAffiliateLink(product.productKey)} target='blank' isExternal={true}>
        <Button mt='4' size='sm'>Original link</Button>
      </Link>
    </Box>
  )
}