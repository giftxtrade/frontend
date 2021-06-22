import { useState } from "react";
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import { DocumentContext } from "next/document";
import Search from "../../../components/Search";
import MyWishlist from "../../../components/MyWishlist";
import eventFetch from "../../../util/ss-event-fetch";
import { IEventProps } from "../[id]";
import { useMediaQuery } from 'react-responsive';

export default function Wishlist(props: IEventProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [event, setEvent] = useState(props.event)
  const [meParticipant, setMeParticipant] = useState(props.meParticipant)
  const [link, setLink] = useState(props.link)

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
            />
          </Container>

          {isMediumScreen ? (
            <></>
          ) : (
              <MyWishlist
                event={event}
              />
          )}
        </Flex>
      </Container>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => eventFetch(ctx);