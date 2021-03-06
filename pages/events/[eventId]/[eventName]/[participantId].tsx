import React, { useEffect, useState } from "react";
import {
  Heading,
  Text,
  Box,
  Stack,
  Container,
  Icon,
  Badge,
  Image,
} from "@chakra-ui/react";
import Head from "next/head";
import Navbar from "../../../../components/Navbar";
import { useMediaQuery } from "@chakra-ui/react";
import { AuthState } from "../../../../store/jwt-payload";
import { IEventFull } from "../../../../types/Event";
import {
  IParticipantUser,
  IParticipantUserWishes,
} from "../../../../types/Participant";
import { api } from "../../../../util/api";
import axios from "axios";
import { MdLocationCity } from "react-icons/md";
import ParticipantWishlist from "../../../../components/ParticipantWishlist";
import PendingInvite from "../../../../components/PendingInvite";
import BackButton from "../../../../components/BackButton";
import { eventNameSlug } from "../../../../util/links";
import { useRouter } from "next/router";
import { authStore } from "../../../../store/auth-store";
import { fetchEvent } from "../[eventName]";
import ErrorBlock from "../../../../components/ErrorBlock";
import { BsExclamationCircle } from "react-icons/bs";
import ContentWrapper from "../../../../components/ContentWrapper"
import { IDrawParticipant } from "../../../../types/Draw"
import EventProfileLoading from "../../../../components/Event/EventProfileLoading"

export default function ParticipantPage() {
  const router = useRouter()
  const { eventId, participantId } = router.query

  const [loading, setLoading] = useState(true) // Loading state for the event page
  const [error, setError] = useState(false)

  const [authState, setAuthState] = useState<AuthState>(authStore.getState())
  const [event, setEvent] = useState<IEventFull>()
  const [meParticipant, setMeParticipant] = useState<IParticipantUser>()
  const [participant, setParticipant] = useState<IParticipantUserWishes>()
  const [myDraw, setMyDraw] = useState<IParticipantUser>()

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
          .get(`${api.participants}/${eventId}/${participantId}`, {
            headers: { Authorization: "Bearer " + authState.accessToken },
          })
          .then(({ data }: { data: IParticipantUserWishes }) => {
            setParticipant({ ...data })
            setLoading(false)
          })
          .catch((_) => {
            setLoading(false)
            setError(true)
          })

        axios
          .get(`${api.draws}/me/${eventId}`, {
            headers: { Authorization: "Bearer " + authState.accessToken },
          })
          .then(({ data }: { data: IDrawParticipant }) => {
            setMyDraw(data.drawee)
          })
          .catch((_) => {})
      },
    )
  }, [authState])

  // Media queries
  const [isMediumScreen] = useMediaQuery("(max-width: 900px)")
  const [isSmallScreen] = useMediaQuery("(max-width: 500px)")

  const name = participant?.user?.name
  const avatarSize = isSmallScreen ? "70px" : "100px"

  const renderParticipantBlock = () => {
    if (error) {
      return (
        <ErrorBlock
          message="Something went wrong. Could not fetch data"
          icon={<Icon as={BsExclamationCircle} boxSize="20" mb="7" />}
        />
      )
    } else if (loading || !participant) {
      return <EventProfileLoading />
    } else if (event && meParticipant && participant) {
      const isMyDraw = myDraw ? myDraw.id === participant.id : false

      return (
        <ContentWrapper
          primary={
            <>
              {!meParticipant.accepted ? (
                <Box mb="5">
                  <PendingInvite
                    event={event}
                    accessToken={authState.accessToken}
                  />
                </Box>
              ) : (
                <></>
              )}

              <BackButton
                href={`/events/${event.id}/${eventNameSlug(event.name)}`}
                value="Back to Event"
              />

              <Box mt="5">
                <Stack spacing="4" mt="5" direction="row">
                  <Box maxW={avatarSize}>
                    <Image
                      src={participant.user?.imageUrl}
                      w={avatarSize}
                      maxW={avatarSize}
                      rounded="xl"
                    />
                  </Box>

                  <Box maxW="full">
                    <Heading size={isSmallScreen ? "md" : "lg"}>{name}</Heading>
                    <Text
                      fontSize={isSmallScreen ? "sm" : "md"}
                      wordBreak="break-all"
                    >
                      {participant.user?.email}
                    </Text>

                    <Stack direction="row" spacing="1" mt="2">
                      {participant.organizer ? (
                        <Badge
                          borderRadius="full"
                          px="2"
                          colorScheme="teal"
                          title={"You are one of the organizers for this event"}
                        >
                          Organizer
                        </Badge>
                      ) : (
                        <></>
                      )}

                      {isMyDraw ? (
                        <Badge
                          borderRadius="full"
                          px="2"
                          colorScheme="purple"
                          title={"You are a participant for this event"}
                        >
                          My Draw
                        </Badge>
                      ) : (
                        <Badge
                          borderRadius="full"
                          px="2"
                          colorScheme="blue"
                          title={"You are a participant for this event"}
                        >
                          Participant
                        </Badge>
                      )}
                    </Stack>

                    <Stack
                      mt="3"
                      direction="row"
                      spacing="2"
                      color="gray.600"
                      fontSize="sm"
                    >
                      <Icon as={MdLocationCity} boxSize="5" />
                      <Text>
                        {participant.address && participant.address !== "" ? (
                          participant.address
                        ) : (
                          <i>No address provided</i>
                        )}
                      </Text>
                    </Stack>
                  </Box>
                </Stack>

                {isMediumScreen ? (
                  <Box mt="14">
                    <ParticipantWishlist
                      name={name}
                      wishlist={participant.wishes}
                      isMyDraw={isMyDraw}
                    />
                  </Box>
                ) : (
                  <></>
                )}
              </Box>
            </>
          }
          sidebar={
            <Container flex="1" pl="2" pr="0">
              {!isMediumScreen ? (
                <ParticipantWishlist
                  name={name}
                  wishlist={participant.wishes}
                  isMyDraw={isMyDraw}
                />
              ) : (
                <></>
              )}
            </Container>
          }
        />
      )
    }
  }

  return (
    <>
      <Head>
        <title>
          {event && participant
            ? `${participant.name} | ${event.name} - GiftTrade`
            : "GiftTrade"}
        </title>
      </Head>

      <Navbar
        loggedIn={authState.loggedIn}
        accessToken={authState.accessToken}
        user={authState.user}
        gToken={authState.gToken}
      />

      <Container maxW="4xl" mb="20">
        {renderParticipantBlock()}
      </Container>
    </>
  )
}
