import { WishlistProductItem } from "./WishlistItem"
import { Dispatch, SetStateAction } from "react"
import { Product } from "@giftxtrade/api-types"
import { Flex, Checkbox, Box } from "@chakra-ui/react"

export interface IWishlistItemSelectProps {
  selectedProducts: Product[]
  product: Product
  removeWish: ((product: Product) => void) | null
  setSelectedProducts: Dispatch<SetStateAction<Product[]>>
}

export default function WishlistItemSelect({
  selectedProducts,
  product,
  removeWish,
  setSelectedProducts,
}: IWishlistItemSelectProps) {
  return (
    <Flex direction="row">
      <Checkbox
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedProducts([...selectedProducts, product])
          } else {
            setSelectedProducts([
              ...selectedProducts.filter((p) => p.id !== product.id),
            ])
          }
        }}
        flex="1"
        pr="5"
        ml="1"
        isChecked={
          selectedProducts.find((p) => p.id === product.id) ? true : false
        }
      />

      <Box flex="100">
        <WishlistProductItem product={product} removeWish={removeWish} />
      </Box>
    </Flex>
  )
}
