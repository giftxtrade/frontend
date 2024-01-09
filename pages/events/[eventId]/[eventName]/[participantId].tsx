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
import { IParticipantUserWishes } from "../../../../types/Participant"
import { api } from "../../../../util/api"
import axios, { AxiosResponse } from "axios"
import { MdLocationCity } from "react-icons/md"
import ParticipantWishlist from "../../../../components/ParticipantWishlist"
import PendingInvite from "../../../../components/PendingInvite"
import BackButton from "../../../../components/BackButton"
import { useRouter } from "next/router"
import { authStore } from "../../../../store/auth-store"
import ErrorBlock from "../../../../components/ErrorBlock"
import { BsExclamationCircle } from "react-icons/bs"
import ContentWrapper from "../../../../components/ContentWrapper"
import { IDrawParticipant } from "../../../../types/Draw"
import EventProfileLoading from "../../../../components/Event/EventProfileLoading"
import { Event, Participant } from "@giftxtrade/api-types"

export default function ParticipantPage() {
  const router = useRouter()
  const authState = authStore.getState()

  const [loading, setLoading] = useState(false) // Loading state for the event page
  const [error, setError] = useState(false)

  const [meParticipant, setMeParticipant] = useState<Participant>()
  const [participant, setParticipant] = useState<Participant>()
  const [myDraw, setMyDraw] = useState<Participant>()

  useEffect(() => {
    const { eventId, participantId } = router.query
    if (!eventId && !participantId) return

    axios
      .get(`${api.participants}/${eventId}/${participantId}`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      })
      .then(({ data }: AxiosResponse<Participant>) => {
        setParticipant({ ...data })
        setLoading(false)
      })
      .catch((_) => {
        setLoading(false)
        setError(true)
      })

    // axios
    //   .get(`${api.draws}/me/${eventId}`, {
    //     headers: { Authorization: "Bearer " + authState.token },
    //   })
    //   .then(({ data }: { data: IDrawParticipant }) => {
    //     setMyDraw(data.drawee)
    //   })
    //   .catch((_) => {})
  }, [authState, router])

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
    } else if (loading) {
      return <EventProfileLoading />
    } else if (participant && participant.event) {
      const isMyDraw = myDraw ? myDraw.id === participant.id : false

      return (
        <ContentWrapper
          primary={
            <>
              {!meParticipant?.accepted ? (
                <Box mb="5">
                  <PendingInvite
                    event={participant.event}
                    accessToken={authState.token}
                  />
                </Box>
              ) : (
                <></>
              )}

              <BackButton
                href={`/events/${participant.event.id}/${participant.event.slug}`}
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

                {isMediumScreen && participant.wishes ? (
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
              {!isMediumScreen && participant.wishes ? (
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
          {participant && participant.event
            ? `${participant.name} | ${participant.event.name} - GiftTrade`
            : "GiftTrade"}
        </title>
      </Head>

      <Navbar />

      <Container maxW="4xl" mb="20">
        {renderParticipantBlock()}
      </Container>
    </>
  )
}
