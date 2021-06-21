import { useState } from "react";
import {
  Flex,
  Spinner,
  Image,
  Heading,
  Text,
  Button,
  Link,
  Box,
  Container
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { DocumentContext } from "next/document";
import { serverSideAuth } from "../../util/server-side-auth";
import axios from 'axios';
import { api } from '../../util/api';
import { IEvent } from '../../types/Event';
import { useMediaQuery } from 'react-responsive';
import EventBoxSm from "../../components/EventBoxSm";
import { IParticipant } from '../../types/Participant';

export default function Event(props: any) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [event, setEvent] = useState(props.event)

  // Media queries
  const isMediumScreen = useMediaQuery({ query: '(max-device-width: 900px)' })

  return (
    <>
      <Head>
        <title>{event.name} - GiftTrade</title>
      </Head>

      <Navbar
        loggedIn={loggedIn}
        accessToken={accessToken}
        user={user}
        gToken={gToken}
      />

      <Container maxW='4xl'>
        <Flex direction='row'>
          <Container
            flex='2'
            pl='1'
          >
            <EventBoxSm
              event={event}
              index={0}
              isInvite={props.meParticipant.accepted ? false : true}
              handleAccept={() => { }}
              handleDecline={() => { }}
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
                <Heading size='md'>My Wishlist</Heading>
              </Container>
          )}
        </Flex>
      </Container>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const idRaw = ctx.query.id;

  const { props } = await serverSideAuth(ctx)

  let event: IEvent | undefined;
  if (props.loggedIn) {
    await axios.get(`${api.events}/${idRaw}`, {
      headers: { "Authorization": "Bearer " + props.accessToken }
    })
      .then(({ data }: { data: IEvent }) => {
        event = data
      })
      .catch(_ => { })
  }

  if (!event) {
    return {
      notFound: true
    }
  }

  let meParticipant: IParticipant | undefined;
  for (const p of event.participants) {
    console.log(p)
    if (p.email === props.user?.email) {
      meParticipant = p
      break;
    }
  }

  return {
    props: {
      accessToken: props.accessToken,
      user: props.user,
      gToken: props.gToken,
      loggedIn: props.loggedIn,
      event: event,
      meParticipant: meParticipant
    }
  }
};