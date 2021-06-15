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
import { FcClearFilters } from 'react-icons/fc'
import Masonry from 'react-masonry-css'
import styles from '../styles/masonary.module.css'
import InfiniteScroll from 'react-infinite-scroll-component'

interface ISearchProps {
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
  const [page, setPage] = useState(1)
  const [infiniteLoading, setInitialLoading] = useState(false)
  const [search, setSearch] = useState('')

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

  const breakpointColumnsObj = {
    default: 3,
    800: 2,
    300: 1
  };

  const renderResults = () => {
    return (
      <>
        {
          initLoading || searchLoading ? (
            <Flex direction='row' maxW='full' alignItems="center" justifyContent="center" p='20'>
              <Spinner size='lg' />
            </Flex>
          ) : (
              <InfiniteScroll
                dataLength={results.length} //This is important field to render the next data
                next={() => {
                  let url = `${api.products}?limit=${pageLimit}&page=${page + 1}&min_price=${minPrice}&max_price=${maxPrice}`
                  setPage(page + 1)
                  if (search !== '' || search.length > 2)
                    url += `&search=${search}`

                  axios.get(url, {
                    headers: {
                      "Authorization": "Beare " + accessToken
                    }
                  }).then(({ data }: { data: IProduct[] }) => {
                    if (data.length === 0) {
                      setHasMore(false)
                      return
                    }

                    setResults(data)
                    setError(false)
                    setResults([...results, ...data])
                    setHasMore(true)
                  }).catch(err => {
                    setError(true)
                    setHasMore(false)
                  })
                }}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>No more results</b>
                  </p>
                }
              >
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className={styles.grid}
                  columnClassName={styles.gridColumn}
                >
                  {results.map((result: IProduct, i) => (
                    <ProductSm
                      product={result}
                      key={`sp#${i}`}
                    />
                  ))}
                </Masonry>
              </InfiniteScroll>
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
              setSearch(event.target.value.trim())
              if (search.length > 2) {
                setPage(1)
                getProducts(setSearchLoading, 1, search)
              }
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

      {
        error ? (
          <Flex direction='column' maxW='full' alignItems="center" justifyContent="center" p='14'>
            <Icon as={FcClearFilters} boxSize='20' mb='7' />
            <Heading size='md' textAlign='center'>No results found</Heading>
          </Flex>
        ) : renderResults()
      }
    </Box>
  )
}