import React, { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Stack,
  Container,
  Link,
  Icon,
  Badge,
  Image
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import { DocumentContext } from "next/document";
import eventFetch from "../../../util/ss-event-fetch";
import { useMediaQuery } from '@chakra-ui/react';
import { IWish } from '../../../types/Wish';
import { User } from '../../../store/jwt-payload';
import { IEvent } from '../../../types/Event';
import { IParticipantUser, IParticipant } from '../../../types/Participant';
import { ILink } from '../../../types/Link';
import BackToEvent from '../../../components/BackToEvent';

export interface IParticipantPageProps {
  accessToken: string
  user: User
  gToken: string
  loggedIn: boolean
  event: IEvent
  participants: IParticipantUser[]
  link: ILink | null
  meParticipant: IParticipant
  myDraw: IParticipant | null
  participant: IParticipantUser
}

export default function ParticipantPage(props: IParticipantPageProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [event, setEvent] = useState(props.event)
  const [participant, setParticipant] = useState(props.participant)
  const [meParticipant, setMeParticipant] = useState(props.meParticipant)
  const [loadingWishes, setLoadingWishes] = useState(true)
  const [wishes, setWishes] = useState(Array<IWish>())
  const [wishProductIds, setWishProductIds] = useState(new Set<number>())

  // Media queries
  const [isMediumScreen] = useMediaQuery('(max-width: 900px)')

  const avatarSize = '100px'

  return (
    <>
      <Head>
        <title>{participant.name} | {event.name} - GiftTrade</title>
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
            <BackToEvent eventId={event.id} />

            <Box mt='5'>
              <Stack spacing='4' mt='5' direction='row'>
                <Box>
                  <Image src={participant.user?.imageUrl} w={avatarSize} maxW={avatarSize} rounded='xl' />
                </Box>

                <Box>
                  <Heading size='lg'>
                    {participant.user ? (
                      participant.user.name === participant.name ?
                        participant.name
                        : `${participant.name} (${participant.user.name})`
                    ) : `${name}`}
                  </Heading>
                  <Text>{participant.user?.email}</Text>

                  <Stack direction='row' spacing='1' mt='2'>
                    {participant.organizer ? (
                      <Badge
                        borderRadius="full"
                        px="2"
                        colorScheme="teal"
                        title={'You are one of the organizers for this event'}
                      >
                        Organizer
                      </Badge>
                    ) : <></>}

                    {participant.participates ? (
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
                </Box>
              </Stack>
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
            </Container>
          )}
        </Flex>
      </Container>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const participantIdRaw = ctx.query.participantId;
  let pId: number
  if (typeof (participantIdRaw) === 'string')
    pId = parseInt(participantIdRaw)
  else if (typeof (participantIdRaw) === 'object')
    pId = parseInt(participantIdRaw[0])

  const { props, notFound } = await eventFetch(ctx)

  if (notFound) {
    return { notFound: true }
  }

  const participant = props?.participants.find(p => p.id == pId)
  if (!participant || !participant.accepted) {
    return { notFound: true }
  }

  return { props: { ...props, participant } }
};