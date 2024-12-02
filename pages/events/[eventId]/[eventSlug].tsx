import Head from "next/head"
import Navbar from "../../../components/Navbar"
import { useState, useEffect, SetStateAction, Dispatch } from "react"
import { authStore } from "../../../store/auth-store"
import { NextRouter, useRouter } from "next/router"
import { api } from "../../../util/api"
import axios, { AxiosResponse } from "axios"
import { Container, Icon } from "@chakra-ui/react"
import { AuthState } from "../../../store/jwt-payload"
import EventComponent from "../../../components/Event/Event"
import { BsExclamationCircle } from "react-icons/bs"
import ErrorBlock from "../../../components/ErrorBlock"
import ContentWrapper from "../../../components/ContentWrapper"
import EventLoading from "../../../components/Event/EventLoading"
import MyWishlist from "../../../components/MyWishlist"
import EventSidebarMedium from "../../../components/Event/EventSidebarMedium"
import { unstable_batchedUpdates } from "react-dom"
import { eventNameSlug } from "../../../util/links"
import EventSidebarLoading from "../../../components/Event/EventSidebarLoading"
import { Event, Participant } from "@giftxtrade/api-types"

export default function EventPage() {
  const [loading, setLoading] = useState(true) // Loading state for the event page
  const [error, setError] = useState(false)
  const [refresh, setRefresh] = useState(false)

  const [authState, setAuthState] = useState<AuthState>(authStore.getState())
  const [event, setEvent] = useState<Event>()
  const [meParticipant, setMeParticipant] = useState<Participant>()
  const [myDraw, setMyDraw] = useState<Participant>()

  const router = useRouter()
  const { eventId, eventSlug } = router.query

  useEffect(() => {
    return fetchEvent(
      eventId,
      eventSlug,
      authState,
      setAuthState,
      setEvent,
      setMeParticipant,
      setError,
      setLoading,
      router,
      window.location.pathname,
      () => {
        axios
          .get(`${api.draws}/me/${eventId}`, {
            headers: { Authorization: "Bearer " + authState.token },
          })
          .then(({ data }: AxiosResponse<Participant>) => {
            setLoading(false)
            setMyDraw(data)
          })
          .catch((_) => {
            setLoading(false)
          })
      },
    )
  }, [authState, refresh, eventId])

  const renderEventBlock = () => {
    if (loading) {
      return (
        <ContentWrapper
          primary={<EventLoading />}
          sidebar={<EventSidebarLoading />}
        />
      )
    } else if (event && meParticipant) {
      return (
        <ContentWrapper
          primary={
            <EventComponent
              event={event}
              authState={authState}
              meParticipant={meParticipant}
              setEvent={setEvent}
              myDraw={myDraw}
              setMyDraw={setMyDraw}
            />
          }
          sidebar={
            <MyWishlist
              event={event}
              accessToken={authState.token}
              meParticipant={meParticipant}
            />
          }
          sidebarMed={
            <EventSidebarMedium
              event={event}
              authState={authState}
              meParticipant={meParticipant}
            />
          }
        />
      )
    } else if (error) {
      return (
        <>
          <ErrorBlock
            message="Event could not be found"
            icon={<Icon as={BsExclamationCircle} boxSize="20" mb="7" />}
          />

          <a href="#" onClick={() => setRefresh(true)}>
            Reload
          </a>
        </>
      )
    }
  }

  return (
    <>
      <Head>
        <title>{event ? `${event.name} - GiftTrade` : "GiftTrade"}</title>

        <meta
          name="description"
          content={loading ? "Loading description" : event?.description}
        />
      </Head>

      <Navbar />

      <Container maxW="4xl" mb="20">
        {renderEventBlock()}
      </Container>
    </>
  )
}

export function fetchEvent(
  eventId: string | string[] | undefined,
  eventSlug: string | string[] | undefined,
  authState: AuthState,
  setAuthState: Dispatch<SetStateAction<AuthState>>,
  setEvent: Dispatch<SetStateAction<Event | undefined>>,
  setMeParticipant: Dispatch<SetStateAction<Participant | undefined>>,
  setError: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: NextRouter,
  currentPath: string,
  callback: () => any,
) {
  setError(false)
  if (!eventId || typeof eventId === "object") {
    setError(true)
    return
  }
  if (!eventSlug || typeof eventSlug === "object") {
    setError(true)
    return
  }

  axios
    .get<Event>(`${api.events}/${eventId}`, {
      headers: { Authorization: `Bearer ${authState.token}` },
    })
    .then(({ data }) => {
      const slug = data.slug ?? eventNameSlug(data.name)
      if (eventSlug !== slug) {
        console.log("pushing new url")
        router.push(`/events/${eventId}/${slug}`)
      }

      unstable_batchedUpdates(() => {
        setEvent(data)
        setMeParticipant(
          data.participants?.find((p) => p.email === authState.user.email)!,
        )
      })

      if (callback) callback()
    })
    .catch((_) => {
      setLoading(false)
      setError(true)
    })
}
