import {
  Box,
  Image,
  Heading,
  Text,
  Button,
  Link,
  Icon,
  Stack,
} from "@chakra-ui/react"
import { generateAmazonAffiliateLink } from "../util/links"
import StarRatings from "react-star-ratings"
import { IoMdAddCircle } from "react-icons/io"
import styles from "../styles/ProductSm.module.css"
import { Product } from "@giftxtrade/api-types"

export interface IProductSmProps {
  product: Product
  productSet: Set<number>

  addWish: (product: Product) => void
  removeWish: (product: Product) => void
}

export default function ProductSm({ product, productSet, addWish }: IProductSmProps) {
  const link = generateAmazonAffiliateLink(product.productKey)

  return (
    <Box
      mb="5"
      id={`product#${product.id}`}
      padding="2"
      rounded="md"
      _hover={{ backgroundColor: "rgba(134, 134, 134, 0.1)" }}
    >
      <Stack direction="row" spacing={10}>
        <Link
          href={link}
          target="blank"
          isExternal={true}
          flex={1}
          display="block"
        >
          <Box className={styles.productImgContainer} rounded="md">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                loading="lazy"
                rounded="md"
                className={`${styles.productImg} skeletonLoading`}
              />
            ) : (
              <Box className="skeletonLoading"></Box>
            )}
          </Box>
        </Link>

        <Stack direction="column" overflow="hidden" flex={3}>
          <Box flex={2} pt={2}>
            <Link href={link} target="blank" isExternal={true}>
              <Heading
                size="sm"
                noOfLines={3}
                title={product.title}
                maxH="57.6px"
                overflow="hidden"
              >
                {product.title}
              </Heading>
            </Link>

            <Box mt="1">
              <Stack direction="row" alignItems="center">
                <StarRatings
                  rating={product.rating}
                  starDimension="15px"
                  starSpacing="1px"
                  starRatedColor="rgb(255, 188, 0)"
                />

                <Text fontSize="sm">
                  {product.totalReviews.toLocaleString()}
                </Text>
              </Stack>
            </Box>
          </Box>

          <Box flex={1}>
            <Stack
              textDecoration="none"
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>{product.price}</Text>

              <Button
                variant="ghost"
                colorScheme="blue"
                onClick={() => addWish(product)}
                isDisabled={productSet.has(product.id)}
                leftIcon={<Icon as={IoMdAddCircle} />}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}
