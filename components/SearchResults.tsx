import { api } from "../util/api"
import ProductSm from "./ProductSm"
import axios from "axios"
import { useState, Dispatch, SetStateAction } from "react"
import { Flex, Spinner, Heading, Box, useMediaQuery } from "@chakra-ui/react"
import { unstable_batchedUpdates } from "react-dom"
import { Product } from "@giftxtrade/api-types"
import { useEffect } from "react"

export interface ISearchResultsProps {
  results: Product[]
  accessToken: string
  pageLimit: number
  minPrice: number
  maxPrice: number
  search: string
  hasMore: boolean
  productSet: Set<number>
  sort: string

  setError: Dispatch<SetStateAction<boolean>>
  setResults: Dispatch<SetStateAction<Product[]>>
  setHasMore: Dispatch<SetStateAction<boolean>>

  addWish: (product: Product) => void
  removeWish: (product: Product) => void
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

    let url = `${api.products}?limit=${pageLimit}&page=${page}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`
    if (search !== "" || search.length > 2) url += `&search=${search}`

    setLoading(true)

    axios
      .get(url, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(({ data }: { data: Product[] }) => {
        unstable_batchedUpdates(() => {
          setError(false)
          try {
            setResults([...results, ...data])
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

  // const loadMore = useInfiniteLoader(callNextPage, {
  //   totalItems: pageLimit * maxPages,
  // })

  // useEffect(() => {
  //   callNextPage()
  // }, [])

  const columnBreakPoints = () => {
    if (isTinyScreen) return 1
    if (isMedSmallScreen) return 2
    return 3
  }

  return (
    <Box ml="-8px" mr="-8px">
      {results.map((product, index) => (
        <ProductSm
          product={product}
          productSet={productSet}
          key={`sp#${index}`}
          addWish={addWish}
          removeWish={removeWish}
        />
      ))}

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
