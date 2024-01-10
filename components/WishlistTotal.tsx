import numberToCurrency from "../util/currency"
import { content } from "../util/content"
import { Stack, Text, Button } from "@chakra-ui/react"
import { Product } from "@giftxtrade/api-types"
import currency from "currency.js"

export interface IWishlistTotalProps {
  selectedProducts: Product[]
  showAddToCart: boolean
}

export default function WishlistTotal({
  selectedProducts,
  showAddToCart,
}: IWishlistTotalProps) {
  const buildAddToCartUrl = (accessKey: string, associatesTag: string) => {
    // https://webservices.amazon.com/paapi5/documentation/add-to-cart-form.html
    const amzBase = "https://www.amazon.com/gp/aws/cart/add.html"
    let urlWithParam = amzBase + `?AWSAccessKeyId=${accessKey}`
    urlWithParam = urlWithParam + `&AssociateTag=${associatesTag}`
    selectedProducts
      .map((p) => p.productKey)
      .forEach((key, i) => {
        urlWithParam += `&ASIN.${i + 1}=${key}&Quantity.${i + 1}=1`
      })
    return urlWithParam
  }

  return (
    <Stack
      spacing="4"
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <Stack spacing="4" direction="row">
        <Text fontWeight="bold">Total</Text>
        <Text>
          {selectedProducts.length === 0
            ? numberToCurrency(0.0)
            : numberToCurrency(
                selectedProducts
                  .map((p) => currency(p.price).value)
                  .reduce((prev, cur) => prev + cur),
              )}
        </Text>
      </Stack>

      {showAddToCart ? (
        <Button
          disabled={selectedProducts.length === 0}
          colorScheme="blue"
          size="sm"
          onClick={() => {
            const cartUrl = buildAddToCartUrl(
              "randomkey",
              content.ASSOCIATE_TAG,
            )
            const newWindow = window.open(cartUrl, "_blank")
          }}
        >
          Add to Cart
        </Button>
      ) : (
        <></>
      )}
    </Stack>
  )
}
