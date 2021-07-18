import numberToCurrency from '../util/currency';
import {
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
  Stack,
  Text,
  Input
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
  const [m, setM] = useState(max.toString())

  const getSortOptions = () => {
    const options = new Array<ReactElement>()
    const tags = ['Rating', 'Price']
    tags.forEach((tag, i) => {
      const tagLower = tag.toLowerCase()

      options.push(
        <option
          value={tagLower}
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
        <label htmlFor='budget'>
          <Text fontWeight='bold' fontSize='xs'>Price</Text>
        </label>

        <Input
          value={m}
          type='number'
          size='xs'
          rounded='md'
          id='budget'
          maxW='5em'
          onChange={e => setM(e.target.value)}
          onKeyDown={(e: any) => {
            if (e.key === 'Enter') {
              let val = 0.0
              try {
                val = parseFloat(m)
              } catch (e) {
                val = 0.0
              }
              setMax(val)
              getProducts(setSearchLoading, 1, undefined, val)
            }
          }}
        />
      </Stack>

      <Stack direction='row' spacing='2' alignItems='center'>
        <label htmlFor='sortOptions'>
          <Text fontWeight='bold' fontSize='xs'>Sort</Text>
        </label>

        <Select
          size='xs'
          rounded='md'
          maxW='5em'
          onChange={e => {
            const tagLower = e.target.value
            setSort(tagLower)
            getProducts(setSearchLoading, 1, undefined, undefined, undefined, tagLower)
          }}
          value={sort}
          id='sortOptions'
        >
          {getSortOptions()}
        </Select>
      </Stack>
    </Stack>
  )
}