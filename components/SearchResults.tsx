import ProductSm from "./ProductSm"
import axios from "axios"
import { useState, Dispatch, SetStateAction } from "react"
import {
  Flex,
  Spinner,
  Heading,
  Box,
  useMediaQuery,
  Text,
} from "@chakra-ui/react"
import { unstable_batchedUpdates } from "react-dom"
import { Product, Wish } from "@giftxtrade/api-types"
import { getSearchUrl, SearchSortType } from "./Search"
import InfiniteScroll from "react-infinite-scroll-component"

export interface ISearchResultsProps {
  products: Product[]
  accessToken: string
  pageLimit: number
  minPrice: number
  maxPrice: number
  search: string
  hasMore: boolean
  productSet: Set<number>
  sort: SearchSortType

  setError: Dispatch<SetStateAction<boolean>>
  setResults: Dispatch<SetStateAction<Product[]>>
  setHasMore: Dispatch<SetStateAction<boolean>>

  addWish: (product: Product) => void
  removeWish: (wish: Wish) => void
}

export default function SearchResults({
  products,
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
  removeWish,
}: ISearchResultsProps) {
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(2)
  const maxPages = 15

  const [isMedSmallScreen] = useMediaQuery("(max-width: 535px)")
  const [isTinyScreen] = useMediaQuery("(max-width: 300px)")

  const callNextPage = () => {
    if (page > maxPages) {
      setHasMore(false)
      return
    }

    setLoading(true)
    const searchUrl = getSearchUrl(
      pageLimit,
      page,
      minPrice,
      maxPrice,
      search,
      sort,
    )
    axios
      .get(searchUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(({ data }: { data: Product[] }) => {
        unstable_batchedUpdates(() => {
          setError(false)
          try {
            setResults([...products, ...data])
          } catch (e) {
            setResults([...data])
          }
          setHasMore(data.length < pageLimit ? false : true)
          setPage(page + 1)
          setLoading(false)
        })
      })
      .catch((err) => {
        unstable_batchedUpdates(() => {
          setHasMore(false)
          setLoading(false)
        })
      })
  }

  const columnBreakPoints = () => {
    if (isTinyScreen) return 1
    if (isMedSmallScreen) return 2
    return 3
  }

  return (
    <Box ml="-8px" mr="-8px">
      <InfiniteScroll
        dataLength={products.length}
        next={callNextPage}
        hasMore
        loader={<></>}
        endMessage={<Text>No more results</Text>}
      >
        {products.map((product, index) => (
          <ProductSm
            product={product}
            productSet={productSet}
            key={`sp#${index}`}
            addWish={addWish}
            removeWish={removeWish}
          />
        ))}
      </InfiniteScroll>

      <Box>
        {loading ? (
          <Flex
            direction="row"
            maxW="full"
            alignItems="center"
            justifyContent="center"
            p="14"
          >
            <Spinner size="md" />
          </Flex>
        ) : !hasMore ? (
          <Flex
            direction="row"
            maxW="full"
            alignItems="center"
            justifyContent="center"
            p="14"
          >
            <Heading textAlign="center" size="sm">
              No more results
            </Heading>
          </Flex>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}
