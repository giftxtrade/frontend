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
  Text,
  Button,
  Link
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'
import React, { useState, SetStateAction } from 'react';
import { unstable_batchedUpdates } from "react-dom";
import { useEffect } from 'react';
import axios from 'axios';
import { api } from '../util/api';
import { IProduct } from '../types/Product';
import { FcClearFilters } from 'react-icons/fc'
import SearchResults from './SearchResults';
import { BsArrowLeft, BsArrowLeftShort, BsChevronLeft } from 'react-icons/bs';
import NextLink from 'next/link';

export interface ISearchProps {
  accessToken: string
  pageLimit: number
  minPrice: number
  maxPrice: number
  eventId: number
  productSet: Set<number>

  addWish: (product: IProduct) => void
  removeWish: (product: IProduct) => void
}

export default function Search({ accessToken, pageLimit, minPrice, maxPrice, eventId, productSet, addWish, removeWish }: ISearchProps) {
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
        unstable_batchedUpdates(() => {
          setError(true)
          setLoadState(false)
        })
        return
      }

      unstable_batchedUpdates(() => {
        setResults(data)
        setLoadState(false)
        setError(false)
        setHasMore(true)
      })
    }).catch(err => {
      unstable_batchedUpdates(() => {
        setError(true)
        setLoadState(false)
        setHasMore(false)
      })
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

                productSet={productSet}

                setError={setError}
                setResults={setResults}
                setHasMore={setHasMore}

                addWish={addWish}
                removeWish={removeWish}
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
      pl='2' pb='2'
      position='relative'
      maxWidth='600px'
    >
      <Box mb='5'>
        <NextLink href={`/events/${eventId}`} passHref>
          <Link>
            <Button
              leftIcon={<Icon as={BsChevronLeft} />}
              size='sm'
            >
              Back to Event
            </Button>
          </Link>
        </NextLink>
      </Box>

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
            onKeyUp={(e: any) => {
              if (e.ctrlKey || e.shiftKey || e.altKey || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'tab')
                return

              const q: string = e.target.value.trim()
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