import { IProduct } from '../types/Product';
import { WishlistProductItem } from './WishlistItem';
import { Dispatch, SetStateAction } from 'react';
import {
  Flex,
  Checkbox,
  Box
} from '@chakra-ui/react';

export interface IWishlistItemSelectProps {
  selectedProducts: IProduct[]
  product: IProduct
  removeWish: ((product: IProduct) => void) | null
  setSelectedProducts: Dispatch<SetStateAction<IProduct[]>>
}

export default function WishlistItemSelect({ selectedProducts, product, removeWish, setSelectedProducts }: IWishlistItemSelectProps) {
  return (
    <Flex direction='row'>
      <Checkbox
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedProducts([...selectedProducts, product])
          } else {
            setSelectedProducts([...selectedProducts.filter(p => p.id !== product.id)])
          }
        }}
        flex='1'
        pr='5'
        ml='1'
        isChecked={selectedProducts.find(p => p.id === product.id) ? true : false}
      />

      <Box flex='100'>
        <WishlistProductItem
          product={product}
          removeWish={removeWish}
        />
      </Box>
    </Flex>
  )
}