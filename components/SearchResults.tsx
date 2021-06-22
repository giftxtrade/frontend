import { api } from '../util/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry from 'react-masonry-css';
import ProductSm from './ProductSm';
import axios from 'axios';
import { IProduct } from '../types/Product';
import styles from '../styles/masonary.module.css'
import { useState, Dispatch, SetStateAction } from 'react';
import { Flex, Spinner, Heading } from '@chakra-ui/react';
import { unstable_batchedUpdates } from "react-dom";

export interface ISearchResultsProps {
  results: IProduct[]
  accessToken: string
  pageLimit: number
  minPrice: number
  maxPrice: number
  search: string
  hasMore: boolean

  setError: Dispatch<SetStateAction<boolean>>
  setResults: Dispatch<SetStateAction<IProduct[]>>
  setHasMore: Dispatch<SetStateAction<boolean>>
}

export default function SearchResults({
  results,
  pageLimit,
  minPrice,
  maxPrice,
  search,
  accessToken,
  hasMore,

  setError,
  setResults,
  setHasMore,
}: ISearchResultsProps) {
  const breakpointColumnsObj = {
    default: 3,
    535: 2,
    450: 1
  };

  const [page, setPage] = useState(2)

  const callNextPage = () => {
    if (page > 6) {
      setHasMore(false)
      return
    }

    let url = `${api.products}?limit=${pageLimit}&page=${page}&min_price=${minPrice}&max_price=${maxPrice}`
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

      unstable_batchedUpdates(() => {
        setError(false)
        setResults([...results, ...data])
        setHasMore(true)
        setPage(page + 1)
      })
    }).catch(err => {
      unstable_batchedUpdates(() => {
        setError(true)
        setHasMore(false)
      })
    })
  }

  return (
    <InfiniteScroll
      dataLength={results.length} //This is important field to render the next data
      next={callNextPage}
      hasMore={hasMore}
      loader={
        <Flex direction='row' maxW='full' alignItems="center" justifyContent="center" p='20'>
          <Spinner size='md' />
        </Flex>
      }
      endMessage={
        <Flex direction='row' maxW='full' alignItems="center" justifyContent="center" p='20'>
          <Heading textAlign='center' size='sm'>No more results</Heading>
        </Flex>
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