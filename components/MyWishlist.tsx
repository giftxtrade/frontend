import {
  Heading,
  Text,
  Button,
  Icon,
  Flex,
  Link,
  Box,
  Stack,
} from "@chakra-ui/react"
import { BsPlusCircle } from "react-icons/bs"
import NextLink from "next/link"
import { IWish } from "../types/Wish"
import { useEffect, useState } from "react"
import axios from "axios"
import { api } from "../util/api"
import { unstable_batchedUpdates } from "react-dom"
import { WishlistLoadingItem, WishlistProductItem } from "./WishlistItem"
import { IProduct } from "../types/Product"
import AddAddress from "./AddAddress";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { eventNameSlug } from "../util/links";
import { Participant, Event } from "@giftxtrade/api-types"

export interface IMyWishlistProps {
  event: Event
  meParticipant: Participant
  accessToken: string
}

export default function MyWishlist({
  event,
  meParticipant,
  accessToken,
}: IMyWishlistProps) {
  const [wishes, setWishes] = useState(Array<IWish>())
  const [loading, setLoading] = useState(true)

  const id = event.id
  const name = event.name

  useEffect(() => {
    axios
      .get(`${api.wishes}/${id}`, {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then(({ data }: { data: IWish[] }) => {
        unstable_batchedUpdates(() => {
          setWishes(data)
          setLoading(false)
        })
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const removeWish = (product: IProduct) => {
    setWishes(wishes.filter((w) => w.product.id !== product.id))
    axios
      .delete(api.wishes, {
        headers: { Authorization: "Bearer " + accessToken },
        data: {
          eventId: id,
          productId: product.id,
          participantId: meParticipant?.id,
        },
      })
      .then(({ data }) => {})
      .catch((_) => {})
  }

  return (
    <>
      <Flex mb="5" direction="row" alignItems="center" justifyContent="start">
        <Heading size="md" m="0" p="0" mt="1.5" mr="5">
          My Wishlist
        </Heading>

        <NextLink
          href={`/events/${id}/${eventNameSlug(name)}/wishlist`}
          passHref
        >
          <Link>
            <Button
              size="md"
              p="0"
              variant="ghost"
              colorScheme="blue"
              spacing="sm"
              title="Add more items to wishlist"
            >
              <Icon as={BsPlusCircle} boxSize="1.5em" />
            </Button>
          </Link>
        </NextLink>
      </Flex>

      <Stack mb="10" direction="column" spacing="2">
        <AddAddress meParticipant={meParticipant} accessToken={accessToken} />
      </Stack>

      <Box overflowX="hidden">
        {loading ? (
          [1, 2].map((p, i) => (
            <Box mb="5" key={`loading#${i}`}>
              <WishlistLoadingItem />
            </Box>
          ))
        ) : wishes.length === 0 ? (
          <Stack justifyContent="center" alignItems="center" spacing="4">
            <Icon as={RiShoppingBag3Fill} color="gray.400" boxSize="24" />
            <Text textAlign="center" color="gray.400">
              Your wishlist is empty. Click the "+" button to add products
            </Text>
          </Stack>
        ) : (
          wishes.map(({ product }, i) => (
            <Box mb="10" key={`wishitem#${i}`}>
              <WishlistProductItem product={product} removeWish={removeWish} />
            </Box>
          ))
        )}
      </Box>
    </>
  )
}