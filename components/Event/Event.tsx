import {
  Heading,
  Text,
  Button,
  Box,
  Icon,
  Badge,
  Stack,
  useMediaQuery,
  useDisclosure,
} from "@chakra-ui/react";
import moment from "moment"
import {
  BsClock,
  BsFillPeopleFill,
  BsFillPersonDashFill,
  BsGearWideConnected,
  BsLink45Deg,
  BsShuffle,
} from "react-icons/bs"
import PendingInvite from "../PendingInvite"
import { AuthState } from "../../store/jwt-payload"
import { Dispatch, SetStateAction, useState } from "react"
import axios, { AxiosResponse } from "axios"
import { api } from "../../util/api"
import { unstable_batchedUpdates } from "react-dom"
import ParticipantUser from "../ParticipantUser"
import styles from "../../styles/eventId.module.css"
import EventOptionsModal from "./EventOptionsModal"
import { Event, Link, Participant } from "@giftxtrade/api-types"

export interface IEventProps {
  event: Event
  authState: AuthState
  meParticipant: Participant
  setEvent: Dispatch<SetStateAction<Event | undefined>>
  myDraw: Participant | undefined
  setMyDraw: Dispatch<SetStateAction<Participant | undefined>>
}

export default function EventComponent({
  event,
  authState,
  meParticipant,
  setEvent,
  myDraw,
  setMyDraw,
}: IEventProps) {
  const [showDraw, setShowDraw] = useState(false)
  const [linkModal, setLinkModal] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)
  const [leaveGroupModal, setLeaveGroupModal] = useState(true)
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkError, setLinkError] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const totalParticipants = event.participants?.filter(
    (p) => p.participates,
  ).length
  const activeParticipants = event.participants?.filter(
    (p) => p.participates && p.accepted,
  ).length

  const [isXSmallScreen] = useMediaQuery("(max-width: 365px)")

  const generateLink = () => {
    setLinkLoading(true)
    setLinkError(false)

    axios
      .post(
        `${api.get_link}/${event.id}`,
        { expirationDate: new Date(event.drawAt).toString() },
        { headers: { Authorization: "Bearer " + authState.token } },
      )
      .then(({ data }: AxiosResponse<Link>) => {
        unstable_batchedUpdates(() => {
          setLinkError(false)
          setLinkLoading(false)

          const eventWithLink: Event = { ...event }
          eventWithLink.links = [data]
          setEvent(eventWithLink)
        })
      })
      .catch((_) => {
        unstable_batchedUpdates(() => {
          setLinkError(true)
          setLinkLoading(false)
        })
      })
  }

  return (
    <>
      {!meParticipant.accepted ? (
        <Box mb="5">
          <PendingInvite event={event} accessToken={authState.token} />
        </Box>
      ) : (
        <></>
      )}

      <Box>
        <Stack direction="row" spacing="1" mb="7">
          {meParticipant.organizer ? (
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

          {meParticipant.participates ? (
            <Badge
              borderRadius="full"
              px="2"
              colorScheme="blue"
              title={"You are a participant for this event"}
            >
              Participant
            </Badge>
          ) : (
            <></>
          )}
        </Stack>

        <Heading size="lg">{event.name}</Heading>

        <Box mt="1" fontSize=".9em" color="gray.600">
          <Stack direction="row" spacing="4">
            <Text title="Draw date">
              <Icon as={BsClock} mr="1" />
              <span>{moment(event.drawAt).format("ll")}</span>
            </Text>

            <Box>
              <Badge
                borderRadius="full"
                px="2"
                colorScheme="teal"
                title="Event budget"
              >
                {event.budget}
              </Badge>
            </Box>

            <Box
              d="flex"
              alignContent="center"
              justifyContent="center"
              title={`${activeParticipants}/${totalParticipants} active participants`}
            >
              <Icon as={BsFillPeopleFill} mr="2" boxSize="1.1em" />
              <span>
                {activeParticipants} / {totalParticipants}
              </span>
            </Box>
          </Stack>
        </Box>

        {event.description ? (
          <Text mt="4" color="gray.700">
            {event.description}
          </Text>
        ) : (
          <></>
        )}

        <Box mt="5">
          <Stack direction="row" spacing="2" justifyContent="flex-end">
            {meParticipant.organizer ? (
              <Button
                leftIcon={<Icon as={BsShuffle} />}
                size={isXSmallScreen ? "xs" : "sm"}
                colorScheme="blue"
                onClick={() => {
                  setShowDraw(true)
                  onOpen()
                }}
                disabled={
                  !event.participants
                    ?.map((v) => v.accepted)
                    ?.reduce((prev, cur) => prev && cur) ||
                  event.participants.length < 2
                }
              >
                Draw
              </Button>
            ) : (
              <></>
            )}
            ;
            <Button
              leftIcon={<Icon as={BsLink45Deg} />}
              size={isXSmallScreen ? "xs" : "sm"}
              colorScheme="teal"
              onClick={() => {
                setLinkModal(true)
                onOpen()
                if (event.links?.length === 0) generateLink()
              }}
            >
              Share Link
            </Button>
            {meParticipant.organizer ? (
              <Button
                leftIcon={<Icon as={BsGearWideConnected} />}
                size={isXSmallScreen ? "xs" : "sm"}
                colorScheme="blackAlpha"
                onClick={() => {
                  setSettingsModal(true)
                  onOpen()
                }}
              >
                Settings
              </Button>
            ) : (
              <Button
                leftIcon={<Icon as={BsFillPersonDashFill} />}
                size={isXSmallScreen ? "xs" : "sm"}
                colorScheme="red"
                onClick={() => {
                  setLeaveGroupModal(true)
                  onOpen()
                }}
                variant="ghost"
              >
                Leave Group
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      {myDraw ? (
        <Box mt="10">
          <Heading size="md" mb="5">
            My Draw
          </Heading>
          <Box maxW="72">
            <ParticipantUser
              user={myDraw.user}
              name={myDraw.name}
              email={myDraw.email}
              participates={myDraw.participates}
              accepted={myDraw.accepted}
              organizer={myDraw.organizer}
              address={myDraw.address}
              id={myDraw.id}
              event={event}
            />
          </Box>
        </Box>
      ) : (
        <></>
      )}

      <div className={styles.participantsPanel}>
        <Box>
          <Heading size="md" mb="5">
            Organizers
          </Heading>

          <Stack direction="column" spacing={5}>
            {event.participants
              ?.filter((p) => p.organizer)
              ?.map((p, i) => (
                <ParticipantUser
                  user={p.user}
                  name={p.name}
                  email={p.email}
                  participates={p.participates}
                  accepted={p.accepted}
                  organizer={p.organizer}
                  address={p.address}
                  id={p.id}
                  event={event}
                  key={`participant#${i}`}
                />
              ))}
          </Stack>
        </Box>

        <Box>
          <Heading size="md" mb="5">
            Participants
          </Heading>
          <Stack direction="column" spacing={5}>
            {event.participants
              ?.filter((p) => p.participates)
              ?.map((p, i) => (
                <ParticipantUser
                  user={p.user}
                  name={p.name}
                  email={p.email}
                  participates={p.participates}
                  accepted={p.accepted}
                  organizer={p.organizer}
                  address={p.address}
                  id={p.id}
                  event={event}
                  key={`participant#${i}`}
                />
              ))}
          </Stack>
        </Box>
      </div>

      <EventOptionsModal
        event={event}
        setEvent={setEvent}
        meParticipant={meParticipant}
        authState={authState}
        myDraw={myDraw}
        setMyDraw={setMyDraw}
        linkModal={linkModal}
        linkLoading={false}
        linkError={false}
        setLinkModal={setLinkModal}
        onClose={onClose}
        showDraw={showDraw}
        setShowDraw={setShowDraw}
        settingsModal={settingsModal}
        setSettingsModal={setSettingsModal}
        leaveGroupModal={leaveGroupModal}
        setLeaveGroupModal={setLeaveGroupModal}
        isOpen={isOpen}
      />
    </>
  )
}
