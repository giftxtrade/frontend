import numberToCurrency from '../util/currency';
import {
  Box,
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
  Stack
} from '@chakra-ui/react';
import { useState, Dispatch, SetStateAction, ReactElement } from 'react';

export interface ISearchOptionsProps {
  min: number
  max: number
  globalMax: number
  search: string

  setSearchLoading: Dispatch<SetStateAction<boolean>>
  getProducts: (setLoadState: (value: SetStateAction<boolean>) => void, page: number, search?: string, max?: number, min?: number) => void
  setSearch: Dispatch<SetStateAction<string>>
  setMax: Dispatch<SetStateAction<number>>
  setMin: Dispatch<SetStateAction<number>>
}

export default function SearchOptions({ min, max, globalMax, search, setSearchLoading, getProducts, setSearch, setMax, setMin }: ISearchOptionsProps) {

  const getBudgetOptions = () => {
    const options = new Array<ReactElement>()
    for (let i = -1; i < 10; i++) {
      let b = +globalMax + (10 * i)
      options.push(
        <option
          value={`budget${b}`}
          onClick={() => {
            setSearch('')
            setMax(b)
            getProducts(setSearchLoading, 1, '', b)
          }}
          key={`budget${b}`}
        >
          Max: {numberToCurrency(b)}
        </option>
      )
    }
    return options.map(o => o);
  }

  return (
    <Stack direction='row' spacing='2' alignItems='center'>
      <Select
        variant="outline"
        defaultValue={`budget${max}`}
        size='sm'
        rounded='md'
        maxW='8.4em'
      >
        {getBudgetOptions()}
      </Select>
    </Stack>
  )
}