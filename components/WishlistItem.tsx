import { Text, Flex, Link, Box, Image, Button, Stack } from "@chakra-ui/react"
import { generateAmazonAffiliateLink } from "../util/links"
import StarRatings from "react-star-ratings"
import { Product, Wish } from "@giftxtrade/api-types"

export function WishlistLoadingItem() {
  return (
    <Flex
      maxW="full"
      h="80px"
      direction="row"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Box
        maxW="full"
        h="80px"
        flex="1"
        rounded="md"
        className="skeletonLoading"
      ></Box>
      <Box maxW="full" h="80px" flex="2" ml="2">
        <Box h="20px" rounded="xl" mb="3" className="skeletonLoading"></Box>

        <Box h="10px" rounded="md" mb="1.5" className="skeletonLoading"></Box>
        <Box maxW="60%" h="10px" rounded="md" className="skeletonLoading"></Box>
      </Box>
    </Flex>
  )
}

export interface IWishlistProductProps {
  product: Product
  wish: Wish
  removeWish: ((wish: Wish) => void) | null
}

export function WishlistProductItem({
  product,
  wish,
  removeWish,
}: IWishlistProductProps) {
  const link = generateAmazonAffiliateLink(product.productKey)

  return (
    <Flex
      maxW="full"
      direction="row"
      alignItems="flex-start"
      justifyContent="flex-start"
    >
      <Box flex="1" maxH="100px" overflow="hidden" rounded="md">
        <Link href={link} isExternal={true}>
          <Image src={product.imageUrl} />
        </Link>
      </Box>
      <Box flex="2" ml="2">
        <Text noOfLines={2} size="xs" mb="1">
          <Link href={link} isExternal={true}>
            {product.title}
          </Link>
        </Text>

        <StarRatings
          rating={product.rating}
          starDimension="13px"
          starSpacing="0.5px"
          starRatedColor="rgb(255, 188, 0)"
        />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize="sm" fontWeight="bold">
            {product.price}
          </Text>

          {removeWish ? (
            <Button
              float="right"
              colorScheme="red"
              size="xs"
              onClick={() => removeWish(wish)}
            >
              Remove
            </Button>
          ) : (
            <></>
          )}
        </Stack>
      </Box>
    </Flex>
  )
}
