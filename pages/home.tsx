import { useState, useEffect } from 'react';
import {
  Flex,
  Spinner,
  Heading,
  Text,
  Button,
  Link,
  Box,
  Container,
  Icon,
  useDisclosure,
  Stack,
  useToast,
  LinkBox,
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { DocumentContext } from "next/document";
import { serverSideAuth } from "../util/server-side-auth";
import { BsPlusCircle } from 'react-icons/bs'
import { NewEvent } from "../components/NewEvent";
import axios from "axios";
import { api } from "../util/api";
import { IEvent } from "../types/Event";
import { User } from "../store/jwt-payload";
import Invites from "../components/Invites";
import { unstable_batchedUpdates } from 'react-dom';
import EventBoxSm from '../components/EventBoxSm';
import { FcClearFilters } from 'react-icons/fc';
import { useMediaQuery } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

export interface IHopeProps {
  accessToken: string,
  user: User,
  gToken: string,
  loggedIn: boolean,
  invites: IEvent[],
}

export default function Home(props: IHopeProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)

  const [invites, setInvites] = useState(props.invites)
  const [events, setEvents] = useState(Array<IEvent>())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const router = useRouter()
  const toast = useToast()

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Responsive
  const [isMediumScreen] = useMediaQuery('(max-width: 900px)')

  useEffect(() => {
    const numInvites = invites.length
    if (numInvites > 0) {
      toast({
        title: numInvites + " " + (numInvites == 1 ? "Pending Invite" : "Pending Invites"),
        status: 'warning',
        description: "You have pending invites. Make sure to accept or decline them and continue",
        duration: 2000,
        isClosable: true,
        variant: 'subtle'
      })
    }

    axios.get(api.events, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }: { data: IEvent[] }) => {
        unstable_batchedUpdates(() => {
          setEvents(data)
          setLoading(false)
        })
      })
      .catch(err => {
        unstable_batchedUpdates(() => {
          setLoading(false);
        })
      })
  }, []);

  const handleAccept = (eventId: number, index: number) => {
    setEvents([invites[index], ...events])
    setInvites(invites.filter((_, i) => i !== index))
    toast({
      title: "Invite accepted!",
      status: "info",
      duration: 2000,
      isClosable: true,
      variant: 'subtle'
    })

    axios.get(`${api.accept_invite}/${eventId}`, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }) => {
        router.push(`/events/${data.id}`)
      })
      .catch(err => console.log(err))
  }

  const handleDecline = (eventId: number, index: number) => {
    setInvites(invites.filter((_, i) => i !== index))
    toast({
      title: "Invite declined!",
      status: "info",
      duration: 2000,
      isClosable: true,
      variant: 'subtle'
    })

    axios.get(`${api.decline_invite}/${eventId}`, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }) => { })
      .catch(err => console.log(err))
  }

  return (
    <>
      <Head>
        <title>Home - GiftTrade</title>
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
            p='1'
          >
            {invites.length > 0 ? (
              <Invites
                invites={invites}
                handleAccept={handleAccept}
                handleDecline={handleDecline}
              />
            ) : <></>}

            <Flex direction='row' alignItems='center' justifyContent='start'>
              <Heading size='lg' m='0' p='0' mt='1.5'>My Events</Heading>

              <Button
                size='lg'
                p='0'
                ml='5'
                variant="ghost"
                colorScheme='blue'
                spacing='sm'
                onClick={onOpen}
              >
                <Icon as={BsPlusCircle} boxSize='1.5em' />
              </Button>
            </Flex>

            <Box mt='5' mb='10'>
              {loading ? (
                <Flex maxW='full' alignItems='center' justifyContent='center' p='20'>
                  <Spinner size='lg' />
                </Flex>
              ) : (
                error || events.length == 0 ? (
                  <Flex
                    direction='column'
                    maxW='full'
                    alignItems="center"
                    justifyContent="center"
                    pt='10' pb='10' pr='5' pl='5'
                    fontStyle='italic'
                  >
                    <Text color='gray.600' size='md' textAlign='center'>You don't have any active events</Text>
                  </Flex>
                ) : (
                  <Stack spacing={3}>
                    {events.map((e, i) => (
                      <NextLink href={`/events/${e.id}`} passHref>
                        <LinkBox cursor='pointer'>
                          <EventBoxSm
                            event={e}
                            isInvite={false}
                            key={`event#${i}`}
                            handleAccept={handleAccept}
                            handleDecline={handleDecline}
                            index={i}
                          />
                        </LinkBox>
                      </NextLink>
                    ))}
                  </Stack>
                )
              )}
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

      <NewEvent
        isOpen={isOpen}
        onClose={onClose}
        accessToken={accessToken}
        user={user}
        addEvent={(e: IEvent) => setEvents([e, ...events])}
      />
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const { props } = await serverSideAuth(ctx)

  let invites: IEvent[] = []

  if (props.loggedIn) {
    await axios.get(api.invites, {
      headers: { "Authorization": "Bearer " + props.accessToken }
    })
      .then(({ data }: { data: IEvent[] }) => {
        invites = data;
      })
      .catch(err => { })
  }

  return {
    props: {
      accessToken: props.accessToken,
      user: props.user,
      gToken: props.gToken,
      loggedIn: props.loggedIn,
      invites: invites
    }
  }
};