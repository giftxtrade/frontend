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
  productSet: Set<number>
  sort: string

  setError: Dispatch<SetStateAction<boolean>>
  setResults: Dispatch<SetStateAction<IProduct[]>>
  setHasMore: Dispatch<SetStateAction<boolean>>

  addWish: (product: IProduct) => void
  removeWish: (product: IProduct) => void
}

export default function SearchResults({
  results,
  pageLimit,
  minPrice,
  maxPrice,
  search,
  accessToken,
  hasMore,
  productSet,
  sort,

  setError,
  setResults,
  setHasMore,

  addWish,
  removeWish
}: ISearchResultsProps) {
  const breakpointColumnsObj = {
    default: 3,
    535: 2,
    300: 1
  };

  const [page, setPage] = useState(2)

  const callNextPage = () => {
    if (page > 6) {
      setHasMore(false)
      return
    }

    let url = `${api.products}?limit=${pageLimit}&page=${page}&min_price=${minPrice}&max_price=${maxPrice}&sort=${sort}`
    if (search !== '' || search.length > 2)
      url += `&search=${search}`

    axios.get(url, {
      headers: {
        "Authorization": "Beare " + accessToken
      }
    }).then(({ data }: { data: IProduct[] }) => {
      unstable_batchedUpdates(() => {
        setError(false)
        setResults([...results, ...data])
        setHasMore(data.length < pageLimit ? false : true)
        setPage(page + 1)
      })
    }).catch(err => {
      unstable_batchedUpdates(() => {
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
            productSet={productSet}
            key={`sp#${i}`}

            addWish={addWish}
            removeWish={removeWish}
          />
        ))}
      </Masonry>
    </InfiniteScroll>
  )
}