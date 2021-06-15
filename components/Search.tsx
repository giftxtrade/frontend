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
  SimpleGrid,
  Icon
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import React, { useState, SetStateAction } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../util/api';
import { IProduct } from '../types/Product';
import ProductSm from './ProductSm';
import { FcHighPriority } from 'react-icons/fc'

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
  const [error, setError] = useState(false)

  const getProducts = (setLoadState: (value: SetStateAction<boolean>) => void, page: number, search?: string) => {
    let url = `${api.products}?limit=${pageLimit}&page=${page}&min_price=${minPrice}&max_price=${maxPrice}`
    if (search) {
      if (search === '' || search.length <= 2)
        return
      url += `&search=${search}`
    }
    setLoadState(true)

    axios.get(url, {
      headers: {
        "Authorization": "Beare " + accessToken
      }
    }).then(({ data }: { data: IProduct[] }) => {
      setResults(data)
      setLoadState(false)
      setError(false)
    }).catch(err => {
      setError(true)
      setLoadState(false)
    })
  }

  useEffect(() => {
    getProducts(setInitLoading, 1)
  }, [])

  const renderResults = () => {
    return (
      <>
        {
          initLoading || searchLoading ? (
            <Flex direction='row' maxW='full' alignItems="center" justifyContent="center" p='20'>
              <Spinner size='lg' />
            </Flex>
          ) : (
            <SimpleGrid columns={3} spacing={4}>
                {results.map((result: IProduct, i) => (
                <ProductSm
                  product={result}
                    key={`sp#${i}`}
                />
              ))}
            </SimpleGrid>
          )
        }
      </>
    )
  }

  return (
    <Box
      flex='2'
      pl='2' pr='2' pb='2'
      position='relative'
    >
      <Box
        pb='2'
        position='sticky'
        top='2'
        mb='1'
      >
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="gray.300"
            fontSize="1em"
            children={<SearchIcon color="gray.400" w='5' />}
          />
          <Input
            bg='white'
            placeholder="Search for products"
            autoFocus={true}
            onKeyUp={(event: any) => getProducts(setSearchLoading, 1, event.target.value.trim())}
            shadow='sm'
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
      </Box>

      {
        error ? (
          <Flex direction='column' maxW='full' alignItems="center" justifyContent="center" p='20'>
            <Icon as={FcHighPriority} boxSize='20' mb='7' />
            <Heading textAlign='center'>Could not reach the server</Heading>
          </Flex>
        ) : renderResults()
      }
    </Box>
  )
}