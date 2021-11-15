import { useState, useEffect } from "react"
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
} from "@chakra-ui/react"
import Head from "next/head"
import Navbar from "../components/Navbar"
import { BsInboxesFill, BsPlusCircle } from "react-icons/bs"
import { NewEvent } from "../components/NewEvent"
import axios from "axios"
import { api } from "../util/api"
import { IEventUser } from "../types/Event"
import { AuthState } from "../store/jwt-payload"
import Invites from "../components/Invites"
import { unstable_batchedUpdates } from "react-dom"
import EventBoxSm from "../components/EventBoxSm"
import { useRouter } from "next/router"
import NextLink from "next/link"
import { eventNameSlug } from "../util/links"
import EventBoxSmLoading from "../components/EventBoxSmLoading"
import { Link } from "@chakra-ui/react"
import * as NLink from "next/link"
import { authStore } from "../store/auth-store"
import ContentWrapper from "../components/ContentWrapper"

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>(authStore.getState())
  const [tryAgainToggle, setTryAgainToggle] = useState(true)

  const [invites, setInvites] = useState(Array<IEventUser>())
  const [events, setEvents] = useState(Array<IEventUser>())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const router = useRouter()
  const toast = useToast()

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    setError(false)
    const unsubscribe = authStore.subscribe(() => {
      setAuthState(authStore.getState())

      if (!authStore.getState().loggedIn) {
        router.push("/login")
      }
    })

    if (!authState.loggedIn) {
      setTryAgainToggle(!tryAgainToggle)
      return () => unsubscribe()
    }

    axios
      .get(`${api.events}?user=true`, {
        headers: { Authorization: "Bearer " + authState.accessToken },
      })
      .then(({ data }: { data: IEventUser[] }) => {
        unstable_batchedUpdates(() => {
          setEvents(data)
          setLoading(false)
        })
      })
      .catch((err) => {
        unstable_batchedUpdates(() => {
          setLoading(false)
        })
      })

    axios
      .get(`${api.invites}`, {
        headers: { Authorization: "Bearer " + authState.accessToken },
      })
      .then(({ data }: { data: IEventUser[] }) => {
        unstable_batchedUpdates(() => {
          setInvites(data)
        })

        const numInvites = data.length
        if (numInvites > 0) {
          toast({
            title:
              numInvites +
              " " +
              (numInvites == 1 ? "Pending Invite" : "Pending Invites"),
            status: "warning",
            description:
              "You have pending invites. Make sure to accept or decline them and continue",
            duration: 2000,
            isClosable: true,
            variant: "subtle",
          })
        }
      })
      .catch((err) => {
        unstable_batchedUpdates(() => {
          setLoading(false)
        })
      })

    return () => unsubscribe()
  }, [tryAgainToggle])

  if (!authState.loggedIn) {
    router.push("/login")
    return <></>
  }

  const handleAccept = (eventId: number, index: number) => {
    setEvents([invites[index], ...events])
    setInvites(invites.filter((_, i) => i !== index))
    toast({
      title: "Invite accepted!",
      status: "info",
      duration: 2000,
      isClosable: true,
      variant: "subtle",
    })

    axios
      .get(`${api.accept_invite}/${eventId}`, {
        headers: { Authorization: "Bearer " + authState.accessToken },
      })
      .then(({ data }) => {
        router.push(`/events/${data.id}/${eventNameSlug(data.name)}`)
      })
      .catch((err) => console.log(err))
  }

  const handleDecline = (eventId: number, index: number) => {
    setInvites(invites.filter((_, i) => i !== index))
    toast({
      title: "Invite declined!",
      status: "info",
      duration: 2000,
      isClosable: true,
      variant: "subtle",
    })

    axios
      .get(`${api.decline_invite}/${eventId}`, {
        headers: { Authorization: "Bearer " + authState.accessToken },
      })
      .then(({ data }) => {})
      .catch((err) => console.log(err))
  }

  return (
    <>
      <Head>
        <title>Home - GiftTrade</title>
      </Head>

      <Navbar
        loggedIn={authState.loggedIn}
        accessToken={authState.accessToken}
        user={authState.user}
        gToken={authState.gToken}
      />

      <Container maxW="4xl" mb="20">
        <ContentWrapper
          primary={
            <Box>
              {invites.length > 0 ? (
                <Invites
                  invites={invites}
                  handleAccept={handleAccept}
                  handleDecline={handleDecline}
                  user={authState.user}
                />
              ) : (
                <></>
              )}

              <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Heading size="md" m="0" p="0" mt="1.5" mr="5">
                  My Events
                </Heading>

                <Button
                  size="sm"
                  colorScheme="gray"
                  onClick={onOpen}
                  leftIcon={<Icon as={BsPlusCircle} />}
                  disabled={loading}
                >
                  New Event
                </Button>
              </Flex>

              <Box
                mt="5"
                mb="10"
                shadow={
                  !loading && (error || events.length) === 0 ? "none" : "base"
                }
                rounded="md"
              >
                {loading ? (
                  <Stack spacing={3}>
                    <EventBoxSmLoading />
                    <EventBoxSmLoading />
                  </Stack>
                ) : error || events.length === 0 ? (
                  <Flex
                    direction="column"
                    maxW="full"
                    alignItems="center"
                    justifyContent="center"
                    pt="10"
                    pb="10"
                    pr="5"
                    pl="5"
                  >
                    <Icon
                      as={BsInboxesFill}
                      fill="gray.700"
                      boxSize="16"
                      mb="5"
                    />
                    <Heading size="lg" mb="2" color="gray.700">
                      No Events
                    </Heading>
                    <Text
                      color="gray.500"
                      fontSize="14"
                      size="md"
                      textAlign="center"
                    >
                      You don't have any active events. Create a new event to
                      get started, or join the{" "}
                      <NextLink href="/i/gOxFJ7d66kr1KY7" passHref>
                        <Link color="blue.400">Public Event</Link>
                      </NextLink>{" "}
                      to test out the GiftTrade platform.
                    </Text>
                  </Flex>
                ) : (
                  <Stack spacing={3}>
                    {events.map((e, i) => (
                      <NLink.default
                        href={`/events/${e.id}/${eventNameSlug(e.name)}`}
                        key={`event#${i}`}
                      >
                        <a
                          className="border-bottom-child"
                          style={{ marginTop: "0px" }}
                        >
                          <EventBoxSm
                            event={e}
                            isInvite={false}
                            handleAccept={handleAccept}
                            handleDecline={handleDecline}
                            index={i}
                            user={authState.user}
                          />
                        </a>
                      </NLink.default>
                    ))}
                  </Stack>
                )}
              </Box>
            </Box>
          }
        />
      </Container>

      {loading ? (
        <></>
      ) : (
        <NewEvent
          isOpen={isOpen}
          onClose={onClose}
          accessToken={authState.accessToken}
          user={authState.user}
          addEvent={(e: IEventUser) => setEvents([e, ...events])}
        />
      )}
    </>
  )
}
