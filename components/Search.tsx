import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Image,
  Spinner,
  Flex,
  SimpleGrid
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../util/api';
import { IProduct } from '../types/Product';
import ProductSm from './ProductSm';

export default function Search(
  { accessToken, pageLimit, minPrice, maxPrice, }: {
    accessToken: string,
    pageLimit: number,
    minPrice: number,
    maxPrice: number,
  }
) {
  const [searchLoading, setSearchLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [results, setResults] = useState(Array<IProduct>())

  useEffect(() => {
    axios.get(`${api.products}?limit=${pageLimit}&page=1&min_price=${minPrice}&max_price=${maxPrice}`, {
      headers: {
        "Authorization": "Beare " + accessToken
      }
    }).then(({ data }: { data: IProduct[] }) => {
      setResults(data)
      setInitLoading(false)
    }).catch(err => console.log(err))
  }, [])

  return (
    <Box
      flex='2'
      pl='2'
      pr='2'
      pb='2'
    >
      <InputGroup mb='5'>
        <InputLeftElement
          pointerEvents="none"
          color="gray.300"
          fontSize="1em"
          children={<SearchIcon color="gray.400" w='5' />}
        />
        <Input
          variant='filled'
          placeholder="Search for products"
          autoFocus={true}
          onKeyUp={(event: any) => console.log(event.target.value)}
        />
        <InputRightElement
          children={
            searchLoading ? (
              <Spinner size='sm' color='gray.500' />
            ) : (
              <></>
            )
          }
        />
      </InputGroup>

      {initLoading ? (
        <Flex direction='row' maxW='full' alignItems="center" justifyContent="center" p='20'>
          <Spinner size='lg' />
        </Flex>
      ) : (
          <SimpleGrid columns={3} spacing={4}>
          {results.map((result: IProduct) => (
            <ProductSm
              product={result}
            />
          ))}
          </SimpleGrid>
      )}
    </Box>
  )
}