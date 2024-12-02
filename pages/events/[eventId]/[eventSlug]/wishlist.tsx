import React, { useState, useEffect } from "react"
import { Flex, Container, Icon, Spinner } from "@chakra-ui/react"
import Head from "next/head"
import Navbar from "../../../../components/Navbar"
import { useRouter } from "next/router"
import { AuthState } from "../../../../store/jwt-payload"
import { authStore } from "../../../../store/auth-store"
import ErrorBlock from "../../../../components/ErrorBlock"
import { BsExclamationCircle } from "react-icons/bs"
import Wishlist from "../../../../components/Wishlist/Wishlist"
import { fetchEvent } from "../[eventSlug]"
import { Participant, Event } from "@giftxtrade/api-types"

export default function WishlistPage() {
  const [loading, setLoading] = useState(true) // Loading state for the event page
  const [error, setError] = useState(false)

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
      () => setLoading(false),
    )
  }, [authState])

  const renderWishlistBlock = () => {
    if (loading) {
      return (
        <Flex
          direction="column"
          maxW="full"
          alignItems="center"
          justifyContent="center"
          p="10"
        >
          <Spinner size="xl" />
        </Flex>
      )
    } else if (event && meParticipant) {
      return (
        <Wishlist
          event={event}
          meParticipant={meParticipant}
          authStore={authState}
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
        <title>
          {event ? `My Wishlist for ${event.name} - GiftTrade` : "GiftTrade"}
        </title>
      </Head>

      <Navbar />

      <Container maxW="4xl" mb="20">
        {renderWishlistBlock()}
      </Container>
    </>
  )
}
