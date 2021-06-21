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
  Container,
  Icon,
  Badge,
  Stack
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
import moment from "moment";
import numberToCurrency from "../../util/currency";
import { BsClock, BsFillPeopleFill } from "react-icons/bs";
import { User } from "../../store/jwt-payload";

export interface IEventProps {
  accessToken: string
  user: User
  gToken: string
  loggedIn: boolean
  event: IEvent
  meParticipant: IParticipant
}

export default function Event(props: IEventProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [event, setEvent] = useState(props.event)
  const [meParticipant, setMeParticipant] = useState(props.meParticipant)

  const totalParticipants = event.participants.filter(p => p.participates).length
  const activeParticipants = event.participants.filter(p => p.participates && p.accepted).length
  const pendingParticipants = totalParticipants - activeParticipants

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
            <Box>
              <Stack direction='row' spacing='1' mb='7'>
                {meParticipant.organizer ? (
                  <Badge
                    borderRadius="full"
                    px="2"
                    colorScheme="teal"
                    title={'You are one of the organizers for this event'}
                  >
                    Organizer
                  </Badge>
                ) : <></>}

                {meParticipant.participates ? (
                  <Badge
                    borderRadius="full"
                    px="2"
                    colorScheme="blue"
                    title={'You are a participant for this event'}
                  >
                    Participant
                  </Badge>
                ) : <></>}
              </Stack>

              <Heading size='lg'>{event.name}</Heading>

              <Box mt='1' fontSize='.9em' color='gray.600'>
                <Stack direction='row' spacing='4'>
                  <Text title='Created on'>
                    <Icon as={BsClock} mr='1' />
                    <span>{moment(event.createdAt).format('ll')}</span>
                  </Text>

                  <Badge
                    borderRadius="full"
                    px="2"
                    colorScheme="teal"
                    title='Event budget'
                    ml='4'
                  >
                    <span>{numberToCurrency(event.budget)}</span>
                  </Badge>

                  <Box
                    ml='5'
                    d='flext'
                    alignContent='center'
                    justifyContent='center'
                    title={`${activeParticipants}/${totalParticipants} active participants`}
                  >
                    <Icon as={BsFillPeopleFill} mr='2' boxSize='1.1em' />
                    <span>{activeParticipants} / {totalParticipants}</span>
                  </Box>
                </Stack>
              </Box>

              {
                event.description ? (
                  <Text mt='4'>{event.description}</Text>
                ) : <></>
              }
            </Box>
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