import numberToCurrency from '../util/currency';
import {
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
  Stack,
  Text
} from '@chakra-ui/react';
import { useState, Dispatch, SetStateAction, ReactElement } from 'react';

export interface ISearchOptionsProps {
  min: number
  max: number
  globalMax: number
  search: string
  sort: string

  setSearchLoading: Dispatch<SetStateAction<boolean>>
  getProducts: (setLoadState: (value: SetStateAction<boolean>) => void, page: number, search?: string, max?: number, min?: number, sort?: string) => void
  setSearch: Dispatch<SetStateAction<string>>
  setMax: Dispatch<SetStateAction<number>>
  setMin: Dispatch<SetStateAction<number>>
  setSort: Dispatch<SetStateAction<string>>
}

export default function SearchOptions({ min, max, globalMax, search, sort, setSearchLoading, getProducts, setSearch, setMax, setMin, setSort }: ISearchOptionsProps) {

  const getBudgetOptions = () => {
    const options = new Array<ReactElement>()
    for (let i = -1; i < 10; i++) {
      let b = +globalMax + (10 * i)
      options.push(
        <option
          value={`budget${b}`}
          onClick={() => {
            setMax(b)
            getProducts(setSearchLoading, 1, '', b)
          }}
          key={`budget${b}`}
        >
          {numberToCurrency(b)}
        </option>
      )
    }
    return options.map(o => o);
  }

  const getSortOptions = () => {
    const options = new Array<ReactElement>()
    const tags = ['Rating', 'Price']
    tags.forEach((tag, i) => {
      const tagLower = tag.toLowerCase()

      options.push(
        <option
          value={`sortBy${tag}`}
          onClick={() => {
            setSort(tagLower)
            getProducts(setSearchLoading, 1, undefined, undefined, undefined, tagLower)
          }}
          key={`sortBy${tag}`}
        >
          {tag}
        </option>
      )
    })
    return options.map(o => o);
  }

  return (
    <Stack direction='row' spacing='4' alignItems='center'>
      <Stack direction='row' spacing='1' alignItems='center'>
        <Text fontWeight='bold' fontSize='sm'>Price</Text>
        <Select
          variant="filled"
          defaultValue={`budget${max}`}
          size='sm'
          rounded='md'
          maxW='6.5em'
        >
          {getBudgetOptions()}
        </Select>
      </Stack>

      <Stack direction='row' spacing='2' alignItems='center'>
        <Text fontWeight='bold' fontSize='sm'>Sort</Text>
        <Select
          variant="filled"
          defaultValue={`budget${max}`}
          size='sm'
          rounded='md'
          maxW='6.5em'
        >
          {getSortOptions()}
        </Select>
      </Stack>
    </Stack>
  )
}