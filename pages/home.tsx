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
  Stack
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

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
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
                      <EventBoxSm
                        event={e}
                        isInvite={false}
                        key={`event#${i}`}
                      />
                    ))}
                  </Stack>
                )
              )}
            </Box>
          </Container>

          <Container
            flex='1'
            pl='2'
            pr='0'
          >
          </Container>
        </Flex>
      </Container>

      <NewEvent
        isOpen={isOpen}
        onClose={onClose}
        accessToken={accessToken}
        user={user}
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