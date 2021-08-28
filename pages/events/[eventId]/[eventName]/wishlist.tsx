import React, { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Container,
  useDisclosure,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  Badge
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../../../components/Navbar';
import { DocumentContext } from "next/document";
import Search from "../../../../components/Search";
import eventFetch from "../../../../util/ss-event-fetch";
import { useMediaQuery } from '@chakra-ui/react';
import { WishlistLoadingItem, WishlistProductItem } from '../../../../components/WishlistItem';
import { IWish } from '../../../../types/Wish';
import axios from 'axios';
import { api } from '../../../../util/api';
import { unstable_batchedUpdates } from 'react-dom';
import { IProduct } from '../../../../types/Product';
import { BsBagFill } from 'react-icons/bs';
import PendingInvite from '../../../../components/PendingInvite';
import WishlistItemSelect from '../../../../components/WishlistItemSelect';
import WishlistTotal from '../../../../components/WishlistTotal';
import styles from '../../../../styles/ParticipantWishlist.module.css'
import { IEventProps } from '../../../../components/Event';

export default function Wishlist(props: IEventProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [event, setEvent] = useState(props.event)
  const [meParticipant, setMeParticipant] = useState(props.meParticipant)
  const [loadingWishes, setLoadingWishes] = useState(true)
  const [wishes, setWishes] = useState(Array<IWish>())
  const [wishProductIds, setWishProductIds] = useState(new Set<number>())
  const [showWishlist, setShowWishlist] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(Array<IProduct>())

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    axios.get(`${api.wishes}/${event.id}`, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }: { data: IWish[] }) => {
        const productIdSet = new Set<number>()
        data.forEach(({ product }) => productIdSet.add(product.id))

        unstable_batchedUpdates(() => {
          setWishes(data)
          setLoadingWishes(false)
          setWishProductIds(productIdSet)
        })
      })
      .catch(err => {
        setLoadingWishes(false)
      })
  }, [])

  const addWish = (product: IProduct) => {
    setWishProductIds(wishProductIds.add(product.id))
    axios.post(api.wishes,
      {
        eventId: event.id,
        productId: product.id,
        participantId: meParticipant.id
      },
      {
        headers: { "Authorization": "Bearer " + accessToken }
      })
      .then(({ data }: { data: IWish }) => {
        setWishes([data, ...wishes])
      })
      .catch(_ => console.log("Could not add wish"))
  }

  const removeWish = (product: IProduct) => {
    wishProductIds.delete(product.id)
    setWishProductIds(wishProductIds)
    setWishes(wishes.filter(w => w.product.id !== product.id))
    axios.delete(api.wishes, {
      headers: { "Authorization": "Bearer " + accessToken },
      data: {
        eventId: event.id,
        productId: product.id,
        participantId: meParticipant.id
      }
    })
      .then(({ data }) => { })
      .catch(_ => { })
  }

  // Media queries
  const [isMediumScreen] = useMediaQuery('(max-width: 900px)')

  return (
    <>
      <Head>
        <title>My Wishlist | {event.name} - GiftTrade</title>
      </Head>

      <Navbar
        loggedIn={loggedIn}
        accessToken={accessToken}
        user={user}
        gToken={gToken}
      />

      <Container maxW='4xl' mb='20'>
        <Flex direction='row'>
          <Container
            flex='2'
            pl='0'
          >
            {!meParticipant.accepted ? (
              <Box mb='5'>
                <PendingInvite
                  event={event}
                  accessToken={accessToken}
                />
              </Box>
            ) : <></>}

            <Search
              accessToken={accessToken}
              minPrice={1}
              maxPrice={event.budget}
              pageLimit={50}
              event={event}

              addWish={addWish}
              removeWish={removeWish}
              productSet={wishProductIds}
            />
          </Container>

          {isMediumScreen ? (
            <></>
          ) : (
            <Container
              flex='1'
              pl='2'
              pr='0'
            >
              <Box position='sticky' top='2'>
                <Box
                  pt='3' pb='3' pl='4' pr='4'
                  bg='white'
                  className={styles.cartReveal}
                >
                  <Heading size='md' mb='3' color='gray.700'>
                    My Wishlist
                  </Heading>

                  <WishlistTotal
                    selectedProducts={selectedProducts}
                    showAddToCart={false}
                  />
                </Box>

                <Box h='90vh' pt='4' pb='7' overflowY='auto' overflowX='hidden'>
                  {
                    loadingWishes ? [1, 2].map((p, i) => (
                      <Box mb='5' key={`loading#${i}`}>
                        <WishlistLoadingItem />
                      </Box>
                    )) : (
                      wishes.length === 0 ? (
                        <Text textAlign='center' color='gray.400'>Your wishlist is empty</Text>
                      ) : (
                        wishes.map(({ product }, i) => (
                          <Box mb='5' key={`wishItem#${i}`}>
                            <WishlistItemSelect
                              product={product}
                              selectedProducts={selectedProducts}
                              setSelectedProducts={setSelectedProducts}
                              removeWish={(pr: IProduct) => {
                                setSelectedProducts(selectedProducts.filter(p => p.id !== pr.id))
                                removeWish(pr)
                              }}
                            />
                          </Box>
                        ))
                      )
                    )
                  }
                </Box>
              </Box>
            </Container>
          )}
        </Flex>
      </Container>

      {isMediumScreen ? (
        <>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={'md'}
            scrollBehavior='inside'
          >
            <ModalOverlay />

            <ModalContent>
              <ModalHeader>My Wishlist</ModalHeader>
              <ModalCloseButton />

              <Box pl='6' pr='6' mb='3'>
                <WishlistTotal
                  selectedProducts={selectedProducts}
                  showAddToCart={false}
                />
              </Box>

              <ModalBody>
                {
                  loadingWishes ? [1, 2].map((p, i) => (
                    <Box mb='5' key={`loading#${i}`}>
                      <WishlistLoadingItem />
                    </Box>
                  )) : (
                    wishes.length === 0 ? (
                      <Text textAlign='center' color='gray.400'>Your wishlist is empty</Text>
                    ) : (
                      wishes.map(({ product }, i) => (
                        <Box mb='5' key={`wishItemMd#${i}`}>
                          <WishlistItemSelect
                            product={product}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            removeWish={(pr: IProduct) => {
                              setSelectedProducts(selectedProducts.filter(p => p.id !== pr.id))
                              removeWish(pr)
                            }}
                          />
                        </Box>
                      ))
                    )
                  )
                }
              </ModalBody>
            </ModalContent>
          </Modal>

          <Box
            p='2' pb='5'
            position='fixed'
            bottom='0' left='50%' zIndex='4'
            transform='translate(-50%, 0)'
          >
            <Button
              boxShadow='dark-lg'
              colorScheme='red'
              size='lg'
              rounded='full'
              p='1'
              onClick={() => {
                setShowWishlist(true)
                onOpen()
              }}
              position='relative'
            >
              <Icon as={BsBagFill} />
              <Box
                position='absolute'
                top='-1'
                right='-1'
              >
                <Badge fontSize="0.8em" colorScheme='red' borderRadius='full'>
                  {wishes.length}
                </Badge>
              </Box>
            </Button>
          </Box>
        </>
      ) : <></>}
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const { props, notFound, redirect } = await eventFetch(ctx)

  if (redirect) {
    return {
      redirect: {
        destination: `${redirect.destination}/wishlist`,
        permanent: false
      }
    }
  }

  if (notFound || !props?.event || !props?.accessToken) {
    return { notFound: true }
  }

  return { props }
};