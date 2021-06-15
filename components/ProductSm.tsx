import Product, { IProduct } from "../types/Product";
import { Box, Image, Heading, Text, Button, Link } from '@chakra-ui/react';

export default function ProductSm({ product }: { product: IProduct }) {
  return (
    <Box mb='5'>
      <Image
        src={product.imageUrl}
        loading='lazy'
        rounded='md'
        mb='3'
      />
      <Heading size='sm' noOfLines={3} mb='4'>{product.title}</Heading>
      <Link href={product.website} target='blank' isExternal={true}>
        <Button size='sm'>Original link</Button>
      </Link>
    </Box>
  )
}