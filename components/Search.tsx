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
import styles from '../styles/Search.module.css';
import SearchOptions from './SearchOptions';
import { IEvent } from '../types/Event';
import BackButton from './BackButton';
import { eventNameSlug } from '../util/links';
import SearchLoading from './SearchLoading';

export interface ISearchProps {
  accessToken: string
  pageLimit: number
  minPrice: number
  maxPrice: number
  event: IEvent
  productSet: Set<number>

  addWish: (product: IProduct) => void
  removeWish: (product: IProduct) => void
}

let timeout: any = null;

export default function Search({ accessToken, pageLimit, minPrice, maxPrice, event, productSet, addWish, removeWish }: ISearchProps) {
  const ignoreKeys = ['Control', 'Alt', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'CapsLock', 'Shift']
  const [searchLoading, setSearchLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(true)
  const [results, setResults] = useState(Array<IProduct>())
  const [error, setError] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchGlobal, setSearchGlobal] = useState('')
  const [scroll, setScroll] = useState(false)
  const [minPriceGlobal, setMinPriceGlobal] = useState(minPrice)
  const [maxPriceGlobal, setMaxPriceGlobal] = useState(maxPrice)
  const [sortGlobal, setSortGlobal] = useState('rating')

  const getProducts = (setLoadState: (value: SetStateAction<boolean>) => void, page: number, search?: string, max?: number, min?: number, sort?: string) => {
    let url = `${api.products}?limit=${pageLimit}&page=${page}&min_price=${min ? min : minPriceGlobal}&max_price=${max ? max : maxPriceGlobal}&sort=${sort ? sort : sortGlobal}&search=${search ? search : searchGlobal}`

    setLoadState(true)

    axios.get(url)
      .then(({ data }: { data: IProduct[] }) => {
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

    getProducts(setInitLoading, 1)
  }, [])

  const renderResults = () => {
    return (
      <>
        {
          initLoading || searchLoading ? (
            <SearchLoading />
          ) : (
              <SearchResults
                results={results}
                pageLimit={pageLimit}
                minPrice={minPriceGlobal}
                maxPrice={maxPriceGlobal}
                accessToken={accessToken}
                search={searchGlobal}
                hasMore={hasMore}
                sort={sortGlobal}

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


  return (
    <Box
      flex='2'
      pl='2' pb='2'
      position='relative'
      maxWidth='600px'
    >
      <BackButton
        href={`/events/${event.id}/${eventNameSlug(event.name)}`}
        value="Back to Event"
      />

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
            placeholder="Keywords, Amazon URL, or ASIN number"
            onKeyUp={(e: any) => {
              for (const k of ignoreKeys) {
                if (e.key === k)
                  return
              }

              const q: string = searchGlobal.trim()
              clearTimeout(timeout);

              timeout = setTimeout(function () {
                window.scrollTo(0, 0)
                getProducts(setSearchLoading, 1, q)
              }, 500);
            }}
            onChange={(e: any) => {
              setSearchGlobal(e.target.value)
            }}
            shadow='sm'
            value={searchGlobal}
          />

          {searchLoading ? (
            <InputRightElement
              children={<Spinner size='sm' color='gray.500' />}
            />
              ) : (
                <></>
          )}
        </InputGroup>

        <Box mt='2' pl='2' pr='2'>
          <SearchOptions
            min={minPrice}
            max={maxPrice}
            sort={sortGlobal}
            setMin={setMinPriceGlobal}
            setMax={setMaxPriceGlobal}
            getProducts={getProducts}
            setSearchLoading={setSearchLoading}
            globalMax={maxPrice}
            search={searchGlobal}
            setSearch={setSearchGlobal}
            setSort={setSortGlobal}
          />
        </Box>
      </Box>

      <Box position='relative' maxW='inherit'>
        <Box mt='3' mb='5'>
          {searchGlobal === '' ? (
            <Text>🔥 Popular items</Text>
          ) : (
              <Text>Search results for <b><i>{searchGlobal}</i></b></Text>
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