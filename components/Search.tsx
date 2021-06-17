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
  Icon,
  Text
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import React, { useState, SetStateAction } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../util/api';
import { IProduct } from '../types/Product';
import { FcClearFilters } from 'react-icons/fc'
import SearchResults from './SearchResults';

export interface ISearchProps {
  accessToken: string
  pageLimit: number
  minPrice: number
  maxPrice: number
}

export default function Search({ accessToken, pageLimit, minPrice, maxPrice, }: ISearchProps) {
  const [searchLoading, setSearchLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [results, setResults] = useState(Array<IProduct>())
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')

  const getProducts = (setLoadState: (value: SetStateAction<boolean>) => void, page: number, search?: string) => {
    let url = `${api.products}?limit=${pageLimit}&page=${page}&min_price=${minPrice}&max_price=${maxPrice}`
    if (search && search.length > 1) {
      url += `&search=${search}`
    }
    setLoadState(true)

    axios.get(url, {
      headers: {
        "Authorization": "Beare " + accessToken
      }
    }).then(({ data }: { data: IProduct[] }) => {
      if (data.length === 0) {
        setError(true)
        setLoadState(false)
        return
      }

      setResults(data)
      setLoadState(false)
      setError(false)
      setHasMore(true)
    }).catch(err => {
      setError(true)
      setLoadState(false)
      setHasMore(false)
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
              <SearchResults
                results={results}
                pageLimit={pageLimit}
                minPrice={minPrice}
                maxPrice={maxPrice}
                accessToken={accessToken}
                search={search}
                hasMore={hasMore}

                setError={setError}
                setResults={setResults}
                setHasMore={setHasMore}
              />
          )
        }
      </>
    )
  }

  let timeout: any = null;

  return (
    <Box
      flex='2'
      pl='2' pr='2' pb='2'
      position='relative'
      maxWidth='600px'
    >
      <Box
        pb='2'
        position='sticky'
        top='2'
        mb='1'
        zIndex='1'
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
            onKeyUp={(event: any) => {
              if (event.ctrlKey || event.shiftKey || event.altKey)
                return

              const q: string = event.target.value.trim()
              clearTimeout(timeout);

              timeout = setTimeout(function () {
                setSearch(q)
                getProducts(setSearchLoading, 1, q)
              }, 500);
            }}
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

      <Box position='relative' maxW='inherit'>
        <Box mt='3' mb='5'>
          {search === '' ? (
            <Text>🔥 Popular items</Text>
          ) : (
            <Text>Search results for <b><i>{search}</i></b></Text>
          )}
        </Box>

        {
          error ? (
            <Flex direction='column' maxW='full' alignItems="center" justifyContent="center" p='14'>
              <Icon as={FcClearFilters} boxSize='20' mb='7' />
              <Heading size='md' textAlign='center'>No results found</Heading>
            </Flex>
          ) : renderResults()
        }
      </Box>
    </Box>
  )
}