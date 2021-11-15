import Head from "next/head";
import Navbar from "../../../components/Navbar";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { authStore } from "../../../store/auth-store";
import { IEventFull } from "../../../types/Event";
import { NextRouter, useRouter } from "next/router";
import { api } from "../../../util/api";
import axios from "axios";
import { Container, Icon } from "@chakra-ui/react"
import { AuthState } from "../../../store/jwt-payload"
import Event from "../../../components/Event/Event"
import { BsExclamationCircle } from "react-icons/bs"
import ErrorBlock from "../../../components/ErrorBlock"
import EventContainer from "../../../components/Event/EventContainer"
import EventLoading from "../../../components/Event/EventLoading"
import { IParticipantUser } from "../../../types/Participant"
import { IDrawParticipant } from "../../../types/Draw"
import MyWishlist from "../../../components/MyWishlist"
import EventSidebarMedium from "../../../components/Event/EventSidebarMedium"
import { unstable_batchedUpdates } from "react-dom"
import { eventNameSlug } from "../../../util/links"
import EventSidebarLoading from "../../../components/Event/EventSidebarLoading"

export default function EventPage() {
  const [loading, setLoading] = useState(true) // Loading state for the event page
  const [error, setError] = useState(false)

  const [authState, setAuthState] = useState<AuthState>(authStore.getState())
  const [event, setEvent] = useState<IEventFull>()
  const [meParticipant, setMeParticipant] = useState<IParticipantUser>()
  const [myDraw, setMyDraw] = useState<IParticipantUser>()

  const router = useRouter()
  const { eventId, eventName } = router.query

  useEffect(() => {
    return fetchEvent(
      eventId,
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
            headers: { Authorization: "Bearer " + authState.accessToken },
          })
          .then(({ data }: { data: IDrawParticipant }) => {
            setLoading(false)
            setMyDraw(data.drawee)
          })
          .catch((_) => {
            setLoading(false)
          })
      },
    )
  }, [authState])

  useEffect(() => {
    if (event && eventName) {
      const properSlug = eventNameSlug(event.name)
      if (eventName != properSlug) {
        console.log("Update to new slug " + properSlug)
        window.history.pushState({}, "", `/events/${eventId}/${eventName}`)
      }
    }
  }, [event])

  const renderEventBlock = () => {
    if (loading) {
      return (
        <EventContainer
          primary={<EventLoading />}
          sidebar={<EventSidebarLoading />}
        />
      )
    } else if (event && meParticipant) {
      return (
        <EventContainer
          primary={
            <Event
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
              accessToken={authState.accessToken}
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
        <ErrorBlock
          message="Event could not be found"
          icon={<Icon as={BsExclamationCircle} boxSize="20" mb="7" />}
        />
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

      <Navbar
        loggedIn={authState.loggedIn}
        accessToken={authState.accessToken}
        user={authState.user}
        gToken={authState.gToken}
      />

      <Container maxW="4xl" mb="20">
        {renderEventBlock()}
      </Container>
    </>
  )
}

export function fetchEvent(
  eventId: number | string | string[] | undefined,
  authState: AuthState,
  setAuthState: Dispatch<SetStateAction<AuthState>>,
  setEvent: Dispatch<SetStateAction<IEventFull | undefined>>,
  setMeParticipant: Dispatch<SetStateAction<IParticipantUser | undefined>>,
  setError: Dispatch<SetStateAction<boolean>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  router: NextRouter,
  currentPath: string,
  callback: () => any,
) {
  setError(false)
  const unsubscribe = authStore.subscribe(() => {
    if (!authStore.getState().loggedIn) {
      router.push(`/login?redirect=${currentPath}`)
    }
    setAuthState(authStore.getState())
  })

  if (!authState.loggedIn || !eventId) {
    if (!authState.loggedIn) {
      router.push(`/login?redirect=${currentPath}`)
      return () => unsubscribe()
    }
    return () => unsubscribe()
  }

  axios
    .get(`${api.events}/${eventId}`, {
      headers: { Authorization: "Bearer " + authState.accessToken },
    })
    .then(({ data }: { data: IEventFull }) => {
      unstable_batchedUpdates(() => {
        setEvent(data)
        setMeParticipant(
          data.participants.find((p) => p.email === authState.user.email),
        )
      })

      if (callback) callback()
    })
    .catch((_) => {
      setLoading(false)
      setError(true)
    })

  return () => unsubscribe()
}