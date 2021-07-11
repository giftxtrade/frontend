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
import eventFetch, { fetchMyDraw } from "../../../util/ss-event-fetch";
import { useMediaQuery } from '@chakra-ui/react';
import { IWish } from '../../../types/Wish';
import { User } from '../../../store/jwt-payload';
import { IEvent } from '../../../types/Event';
import { IParticipantUser, IParticipant } from '../../../types/Participant';
import { ILink } from '../../../types/Link';
import BackToEvent from '../../../components/BackToEvent';
import { api } from '../../../util/api';
import axios from 'axios';
import { WishlistProductItem } from '../../../components/WishlistItem';
import { MdLocationCity } from 'react-icons/md'
import ParticipantWishlist from '../../../components/ParticipantWishlist';
import PendingInvite from '../../../components/PendingInvite';

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
  wishlist: IWish[]
}

export default function ParticipantPage(props: IParticipantPageProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [event, setEvent] = useState(props.event)
  const [participant, setParticipant] = useState(props.participant)
  const [wishlist, setWishlist] = useState(props.wishlist)
  const [meParticipant, setMeParticipant] = useState(props.meParticipant)
  const [myDraw, setMyDraw] = useState(props.myDraw)
  const [isMyDraw, setIsMyDraw] = useState(myDraw?.email === participant.email)

  // Media queries
  const [isMediumScreen] = useMediaQuery('(max-width: 900px)')
  const [isSmallScreen] = useMediaQuery('(max-width: 500px)')

  const name = participant.user?.name
  const avatarSize = isSmallScreen ? '70px' : '100px'

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
            {!meParticipant.accepted ? (
              <Box mb='5'>
                <PendingInvite
                  event={event}
                  accessToken={accessToken}
                />
              </Box>
            ) : <></>}

            <BackToEvent eventId={event.id} />

            <Box mt='5'>
              <Stack spacing='4' mt='5' direction='row'>
                <Box maxW={avatarSize}>
                  <Image
                    src={participant.user?.imageUrl}
                    w={avatarSize} maxW={avatarSize}
                    rounded='xl'
                  />
                </Box>

                <Box maxW='full'>
                  <Heading size={isSmallScreen ? 'md' : 'lg'}>
                    {name}
                  </Heading>
                  <Text fontSize={isSmallScreen ? 'sm' : 'md'} wordBreak='break-all'>
                    {participant.user?.email}
                  </Text>

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

                    {isMyDraw ? (
                      <Badge
                        borderRadius="full"
                        px="2"
                        colorScheme="purple"
                        title={'You are a participant for this event'}
                      >
                        My Draw
                      </Badge>
                    ) : (
                      <Badge
                        borderRadius="full"
                        px="2"
                          colorScheme="blue"
                        title={'You are a participant for this event'}
                      >
                        Participant
                      </Badge>
                    )}
                  </Stack>

                  <Stack mt='3' direction='row' spacing='2' color='gray.600' fontSize='sm'>
                    <Icon as={MdLocationCity} boxSize='5' />
                    <Text>{participant.address && participant.address !== '' ? participant.address : <i>No address provided</i>}</Text>
                  </Stack>
                </Box>
              </Stack>

              {isMediumScreen ? (
                <Box mt='14'>
                  <ParticipantWishlist
                    name={name}
                    wishlist={wishlist}
                    isMyDraw={isMyDraw}
                  />
                </Box>
              ) : <></>}
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
              {!isMediumScreen ? (
                <ParticipantWishlist
                  name={name}
                  wishlist={wishlist}
                    isMyDraw={isMyDraw}
                />) : <></>}
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

  if (notFound || !props?.event || !props?.accessToken) {
    return { notFound: true }
  }

  const participant = props?.participants.find(p => p.id == pId)
  if (!participant || !participant.accepted) {
    return { notFound: true }
  }

  const myDraw = await fetchMyDraw(props.event.id, props.accessToken)

  let wishlist: IWish[] | null = null;
  await axios.get(`${api.wishes}/${props?.event.id}/${participant.id}`, {
    headers: { "Authorization": "Bearer " + props?.accessToken }
  })
    .then(({ data }: { data: IWish[] }) => {
      wishlist = data
    })
    .catch(err => {
      wishlist = null
    })

  if (!wishlist) {
    return { notFound: true }
  }

  return { props: { ...props, participant, wishlist, myDraw } }
};