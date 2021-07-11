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
import Navbar from '../../../components/Navbar';
import { DocumentContext } from "next/document";
import Search from "../../../components/Search";
import eventFetch from "../../../util/ss-event-fetch";
import { IEventProps } from "../[eventId]";
import { useMediaQuery } from '@chakra-ui/react';
import { WishlistLoadingItem, WishlistProductItem } from '../../../components/WishlistItem';
import { IWish } from '../../../types/Wish';
import axios from 'axios';
import { api } from '../../../util/api';
import { unstable_batchedUpdates } from 'react-dom';
import { IProduct } from '../../../types/Product';
import { BsBagFill } from 'react-icons/bs';
import PendingInvite from '../../../components/PendingInvite';

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
              eventId={event.id}

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
                <Flex mb='7' direction='row' alignItems='center' justifyContent='start'>
                  <Heading size='md' m='0' p='0' mt='1.5'>My Wishlist</Heading>
                </Flex>

                  <Box h='90vh' overflowY='auto' overflowX='hidden'>
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
                          <Box mb='10' key={`wishitem#${i}`}>
                            <WishlistProductItem
                              product={product}
                              removeWish={removeWish}
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
          >
            <ModalOverlay />

            <ModalContent>
              <ModalHeader>My Wishlist</ModalHeader>
              <ModalCloseButton />
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
                        <Box mb='10' key={`wishitem#${i}`}>
                          <WishlistProductItem
                            product={product}
                            removeWish={removeWish}
                          />
                        </Box>
                      ))
                    )
                  )
                }
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
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

export const getServerSideProps = async (ctx: DocumentContext) => eventFetch(ctx);