import { useState, useEffect } from 'react';
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import { DocumentContext } from "next/document";
import Search from "../../../components/Search";
import eventFetch from "../../../util/ss-event-fetch";
import { IEventProps } from "../[id]";
import { useMediaQuery } from 'react-responsive';
import { WishlistLoadingItem, WishlistProductItem } from '../../../components/WishlistItem';
import { IWish } from '../../../types/Wish';
import axios from 'axios';
import { api } from '../../../util/api';
import { unstable_batchedUpdates } from 'react-dom';
import { IProduct } from '../../../types/Product';

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
      .catch()
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
  }

  // Media queries
  const isMediumScreen = useMediaQuery({ query: '(max-device-width: 900px)' })

  return (
    <>
      <Head>
        <title>{event.name} | Wishlist - GiftTrade</title>
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

                  <Box h='90vh' overflowY='auto'>
                    {
                      loadingWishes ? [1, 2].map((p, i) => (
                        <Box mb='5' key={`loading#${i}`}>
                          <WishlistLoadingItem />
                        </Box>
                      )) : (
                        wishes.length === 0 ? (
                          <Text textAlign='center' color='gray.400'>Your wishlist is empty. Click the "+" button to add products</Text>
                        ) : (
                          wishes.map(({ product }, i) => (
                            <Box mb='10' key={`wishitem#${i}`}>
                              <WishlistProductItem product={product} />
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
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => eventFetch(ctx);