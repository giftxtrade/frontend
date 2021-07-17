import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Flex,
  Icon,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
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
import BackToEvent from './BackToEvent';
import numberToCurrency from '../util/currency';
import styles from '../styles/Search.module.css';

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

const defaultSearchQ = 'new';

export default function Search({ accessToken, pageLimit, minPrice, maxPrice, eventId, productSet, addWish, removeWish }: ISearchProps) {
  const ignoreKeys = ['Control', 'Alt', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'CapsLock', 'Shift']
  const [searchLoading, setSearchLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [results, setResults] = useState(Array<IProduct>())
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [search, setSearch] = useState('')
  const [scroll, setScroll] = useState(false)

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
      unstable_batchedUpdates(() => {
        setResults(data)
        setLoadState(false)
        setError(false)
        setHasMore(data.length < pageLimit ? false : true)
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
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 200)
          setScroll(true)
        else
          setScroll(false)
      });
    }

    getProducts(setInitLoading, 1, defaultSearchQ)
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
      <BackToEvent eventId={eventId} />

      <Box
        pt='2' pb='2'
        position='sticky'
        top='0'
        mb='1'
        zIndex='1'
        bg='white'
        className={scroll ? styles.searchContainerBoxReveal : styles.searchContainerBoxHide}
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
              for (const k of ignoreKeys) {
                if (e.key === k)
                  return
              }

              const q: string = e.target.value.trim()
              clearTimeout(timeout);

              timeout = setTimeout(function () {
                const s = q === '' ? defaultSearchQ : q;
                setSearch(s)
                window.scrollTo(0, 0)
                getProducts(setSearchLoading, 1, s)
              }, 500);
            }}
            shadow='sm'
          />

          {searchLoading ? (
            <InputRightElement
              children={<Spinner size='sm' color='gray.500' />}
            />
              ) : (
                <></>
          )}
        </InputGroup>

        <Box mt='4'>
          <Tag
            size='md'
            borderRadius="full"
            variant="solid"
            colorScheme='gray'
          >
            <TagLabel>Budget <b>{numberToCurrency(maxPrice)}</b></TagLabel>
            <TagCloseButton />
          </Tag>
        </Box>
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