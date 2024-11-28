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
import axios, { AxiosResponse } from "axios"
import { api } from "../util/api"
import { AuthState } from "../store/jwt-payload"
import Invites from "../components/Invites"
import { unstable_batchedUpdates } from "react-dom"
import EventBoxSm from "../components/EventBoxSm"
import { useRouter } from "next/router"
import NextLink from "next/link"
import EventBoxSmLoading from "../components/EventBoxSmLoading"
import { Link } from "@chakra-ui/react"
import * as NLink from "next/link"
import { authStore } from "../store/auth-store"
import ContentWrapper from "../components/ContentWrapper"
import { Event } from "@giftxtrade/api-types"
import { eventNameSlug } from "../util/links"

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>(authStore.getState())
  const [tryAgainToggle, setTryAgainToggle] = useState(true)

  const [invites, setInvites] = useState(Array<Event>())
  const [events, setEvents] = useState(Array<Event>())
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
      .get(api.events, {
        headers: { Authorization: "Bearer " + authState.token },
      })
      .then(({ data }: AxiosResponse<Event[]>) => {
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
        headers: { Authorization: "Bearer " + authState.token },
      })
      .then(({ data }: AxiosResponse<Event[]>) => {
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

  const handleAccept = (eventId: number) => {
    axios
      .get(`${api.accept_invite}/${eventId}`, {
        headers: { Authorization: "Bearer " + authState.token },
      })
      .then(({ data: event }: AxiosResponse<Event>) => {
        setEvents(
          [event, ...events].sort((a, b) => a.drawAt.localeCompare(b.drawAt)),
        )
        setInvites(invites.filter(({ id }) => id !== event.id))
        toast({
          title: "Invite accepted!",
          status: "info",
          duration: 2000,
          isClosable: true,
          variant: "subtle",
        })
        router.push(`/events/${event.id}/${event.slug}`)
      })
      .catch((_err) => {
        toast({
          title: "Could not accept invite. Please try again.",
          status: "error",
          duration: 2000,
          isClosable: true,
          variant: "subtle",
        })
      })
  }

  const handleDecline = (eventId: number) => {
    setInvites(invites.filter((e) => e.id !== eventId))
    toast({
      title: "Invite declined!",
      status: "info",
      duration: 2000,
      isClosable: true,
      variant: "subtle",
    })

    axios
      .get(`${api.decline_invite}/${eventId}`, {
        headers: { Authorization: "Bearer " + authState.token },
      })
      .then(({ data }) => {})
      .catch((err) => console.log(err))
  }

  return (
    <>
      <Head>
        <title>Home - GiftTrade</title>
      </Head>

      <Navbar />

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
                        href={`/events/${e.id}/${
                          e.slug ?? eventNameSlug(e.name)
                        }`}
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
          accessToken={authState.token}
          user={authState.user}
          addEvent={(e: Event) => setEvents([e, ...events])}
        />
      )}
    </>
  )
}
