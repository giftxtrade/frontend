import { AuthState } from "../../store/jwt-payload"
import React, { useState, useEffect } from "react"
import {
  Heading,
  Text,
  Box,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  useMediaQuery,
} from "@chakra-ui/react"
import axios, { AxiosResponse } from "axios"
import { unstable_batchedUpdates } from "react-dom"
import styles from "../../styles/ParticipantWishlist.module.css"
import { api } from "../../util/api"
import PendingInvite from "../PendingInvite"
import Search from "../Search"
import WishlistTotal from "../WishlistTotal"
import { WishlistLoadingItem } from "../WishlistItem"
import WishlistItemSelect from "../WishlistItemSelect"
import WishlistNav from "../WishlistNav"
import ContentWrapper from "../ContentWrapper"
import {
  Product,
  Event,
  Participant,
  Wish,
  DeleteWish,
} from "@giftxtrade/api-types"
import currency from "currency.js"
import { useToast } from "@chakra-ui/react"

export interface IWishlistProps {
  event: Event
  meParticipant: Participant
  authStore: AuthState
}

export default function Wishlist({
  event,
  meParticipant,
  authStore,
}: IWishlistProps) {
  const [loadingWishes, setLoadingWishes] = useState(true)
  const [wishes, setWishes] = useState(Array<Wish>())
  const [wishProductIds, setWishProductIds] = useState(new Set<number>())
  const [showWishlist, setShowWishlist] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(Array<Product>())

  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    axios
      .get(`${api.wishes}/${event.id}/${meParticipant.id}`, {
        headers: { Authorization: "Bearer " + authStore.token },
      })
      .then(({ data }: AxiosResponse<Wish[]>) => {
        const productIdSet = new Set<number>()
        data.forEach(({ product }) => {
          if (product) productIdSet.add(product.id)
        })

        unstable_batchedUpdates(() => {
          setWishes(data)
          setLoadingWishes(false)
          setWishProductIds(productIdSet)
          setSelectedProducts(
            data
              .filter(({ product }) => product)
              .map(({ product }) => product!),
          )
        })
      })
      .catch((err) => {
        setLoadingWishes(false)
      })
  }, [])

  const addWish = (product: Product) => {
    setWishProductIds(wishProductIds.add(product.id))
    axios
      .post(
        `${api.wishes}/${event.id}`,
        {
          productId: product.id,
        },
        {
          headers: { Authorization: "Bearer " + authStore.token },
        },
      )
      .then(({ data }: AxiosResponse<Wish>) => {
        setWishes([data, ...wishes])
        if (data.product)
          setSelectedProducts([...selectedProducts, data.product])
      })
      .catch((_) => {
        toast({
          title: "Could not add wish",
          status: "error",
        })
      })
  }

  const removeWish = (wish: Wish) => {
    wishProductIds.delete(wish.product?.id ?? 0)
    setWishProductIds(wishProductIds)
    setWishes(wishes.filter((w) => w.product?.id !== wish.product?.id))
    const productsCopy = [...selectedProducts]
    axios
      .delete(`${api.wishes}/${event.id}`, {
        headers: { Authorization: "Bearer " + authStore.token },
        data: {
          wishId: wish.id,
        } as DeleteWish,
      })
      .then(({ data }: AxiosResponse<Wish>) => {
        setSelectedProducts(
          selectedProducts.filter((p) => p.id !== data.product?.id),
        )
      })
      .catch((_) => {
        toast({
          title: "Wish item was not delete. Please try again.",
          status: "error",
        })
        setSelectedProducts(productsCopy)
      })
  }

  // Media queries
  const [isMediumScreen] = useMediaQuery("(max-width: 900px)")

  return (
    <>
      <ContentWrapper
        primary={
          <>
            {!meParticipant.accepted ? (
              <Box mb="5">
                <PendingInvite event={event} accessToken={authStore.token} />
              </Box>
            ) : (
              <></>
            )}

            <Search
              accessToken={authStore.token}
              minPrice={1}
              maxPrice={currency(event.budget).value}
              pageLimit={50}
              event={event}
              addWish={addWish}
              removeWish={removeWish}
              productSet={wishProductIds}
            />
          </>
        }
        sidebar={
          <Box position="sticky" top="2">
            <Box
              pt="3"
              pb="3"
              pl="4"
              pr="4"
              bg="white"
              className={styles.cartReveal}
            >
              <Heading size="md" mb="3" color="gray.700">
                My Wishlist
              </Heading>

              <WishlistTotal
                selectedProducts={selectedProducts}
                showAddToCart={false}
              />
            </Box>

            <Box h="90vh" pt="4" pb="7" overflowY="auto" overflowX="hidden">
              {loadingWishes ? (
                [1, 2].map((p, i) => (
                  <Box mb="5" key={`loading#${i}`}>
                    <WishlistLoadingItem />
                  </Box>
                ))
              ) : wishes.length === 0 ? (
                <Text textAlign="center" color="gray.400">
                  Your wishlist is empty
                </Text>
              ) : (
                wishes.map((wish, i) =>
                  wish.product ? (
                    <Box mb="5" key={`wishItem#${i}`}>
                      <WishlistItemSelect
                        product={wish.product}
                        wish={wish}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        removeWish={(w: Wish) => {
                          setSelectedProducts(
                            selectedProducts.filter(
                              (p) => p.id !== w.product?.id,
                            ),
                          )
                          removeWish(w)
                        }}
                      />
                    </Box>
                  ) : (
                    <></>
                  ),
                )
              )}
            </Box>
          </Box>
        }
        sidebarMed={
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={"md"}
            scrollBehavior="inside"
          >
            <ModalOverlay />

            <ModalContent>
              <ModalHeader>My Wishlist</ModalHeader>
              <ModalCloseButton />

              <Box pl="6" pr="6" mb="3">
                <WishlistTotal
                  selectedProducts={selectedProducts}
                  showAddToCart={false}
                />
              </Box>

              <ModalBody>
                {loadingWishes ? (
                  [1, 2].map((p, i) => (
                    <Box mb="5" key={`loading#${i}`}>
                      <WishlistLoadingItem />
                    </Box>
                  ))
                ) : wishes.length === 0 ? (
                  <Text textAlign="center" color="gray.400">
                    Your wishlist is empty
                  </Text>
                ) : (
                  wishes.map((wish, i) =>
                    wish.product ? (
                      <Box mb="5" key={`wishItemMd#${i}`}>
                        <WishlistItemSelect
                          product={wish.product}
                          wish={wish}
                          selectedProducts={selectedProducts}
                          setSelectedProducts={setSelectedProducts}
                          removeWish={(w: Wish) => {
                            setSelectedProducts(
                              selectedProducts.filter(
                                (p) => p.id !== w.product?.id,
                              ),
                            )
                            removeWish(w)
                          }}
                        />
                      </Box>
                    ) : (
                      <></>
                    ),
                  )
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        }
      />

      <WishlistNav onOpen={onOpen} numWishes={wishes.length} />
    </>
  )
}
