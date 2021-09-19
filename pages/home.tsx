import { useState, useEffect } from 'react';
import {
  Flex,
  Heading,
  Text,
  Button,
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
import { BsInboxesFill, BsInboxFill, BsPlusCircle } from 'react-icons/bs'
import { NewEvent } from "../components/NewEvent";
import axios from "axios";
import { api } from "../util/api";
import { IEventUser, IEvent } from '../types/Event';
import { User } from "../store/jwt-payload";
import Invites from "../components/Invites";
import { unstable_batchedUpdates } from 'react-dom';
import EventBoxSm from '../components/EventBoxSm';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { eventNameSlug } from '../util/links';
import EventBoxSmLoading from '../components/EventBoxSmLoading';
import styles from '../styles/home.module.css'
import { Link } from '@chakra-ui/react';

export interface IHopeProps {
  accessToken: string,
  user: User,
  gToken: string,
  loggedIn: boolean,
  invites: IEventUser[],
}

export default function Home(props: IHopeProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)

  const [invites, setInvites] = useState(props.invites)
  const [events, setEvents] = useState(Array<IEventUser>())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const router = useRouter()
  const toast = useToast()

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

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

    axios.get(`${api.events}?user=true`, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }: { data: IEventUser[] }) => {
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
        router.push(`/events/${data.id}/${eventNameSlug(data.name)}`)
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
        <Box
          className={styles.sideContainer}
          p='1'
        >
          {invites.length > 0 ? (
            <Invites
              invites={invites}
              handleAccept={handleAccept}
              handleDecline={handleDecline}
              user={user}
            />
          ) : <></>}

          <Flex direction='row' alignItems='center' justifyContent='space-between'>
            <Heading fontSize='2xl' m='0' p='0' mt='1.5' mr='5'>My Events</Heading>

            <Button
              size='sm'
              colorScheme='gray'
              onClick={onOpen}
              leftIcon={<Icon as={BsPlusCircle} />}
            >
              New Event
            </Button>
          </Flex>

          <Box
            mt='5' mb='10'
            shadow={!loading && (error || events.length) === 0 ? 'none' : 'base'}
            rounded='md'
          >
            {loading ? (
              <Stack spacing={3}>
                <EventBoxSmLoading />
                <EventBoxSmLoading />
              </Stack>
            ) : (
                error || events.length === 0 ? (
                <Flex
                  direction='column'
                  maxW='full'
                  alignItems="center"
                  justifyContent="center"
                    pt='10' pb='10' pr='5' pl='5'
                >
                    <Icon as={BsInboxesFill} fill='gray.700' boxSize='16' mb='5' />
                    <Heading size='lg' mb='2' color='gray.700'>No Events</Heading>
                    <Text color='gray.500' fontSize='14' size='md' textAlign='center'>
                      You don't have any active events. Create a new event to get started, or join the <NextLink href='/i/gOxFJ7d66kr1KY7' passHref><Link color='blue.400'>Public Event</Link></NextLink> to test out the GiftTrade platform.
                    </Text>
                </Flex>
              ) : (
                <Stack spacing={3}>
                  {events.map((e, i) => (
                    <NextLink href={`/events/${e.id}/${eventNameSlug(e.name)}`} passHref>
                      <LinkBox cursor='pointer' mt='0!important' className='border-bottom-child'>
                        <EventBoxSm
                          event={e}
                          isInvite={false}
                          key={`event#${i}`}
                          handleAccept={handleAccept}
                          handleDecline={handleDecline}
                          index={i}
                          user={user}
                        />
                      </LinkBox>
                    </NextLink>
                  ))}
                </Stack>
              )
            )}
          </Box>
        </Box>
      </Container>

      <NewEvent
        isOpen={isOpen}
        onClose={onClose}
        accessToken={accessToken}
        user={user}
        addEvent={(e: IEventUser) => setEvents([e, ...events])}
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