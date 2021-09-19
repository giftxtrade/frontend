import { useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Container,
  Icon,
  Badge,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from './Navbar';
import axios from 'axios';
import { api } from '../util/api';
import { IEvent } from '../types/Event';
import { useMediaQuery } from '@chakra-ui/react';
import { IParticipant, IParticipantUser } from '../types/Participant';
import moment from "moment";
import numberToCurrency from "../util/currency";
import { BsBagFill, BsClock, BsFillPeopleFill, BsFillPersonDashFill, BsGearWideConnected, BsLink45Deg, BsShuffle } from "react-icons/bs";
import { User } from "../store/jwt-payload";
import { ILink } from '../types/Link';
import ParticipantUser from './ParticipantUser';
import GetLinkEvent from './GetLinkEvent';
import { unstable_batchedUpdates } from "react-dom";
import MyWishlist from './MyWishlist';
import Draws from './Draws';
import Settings from './Settings';
import LeaveGroup from './LeaveGroup';
import PendingInvite from './PendingInvite';
import styles from '../styles/eventId.module.css'
import WishlistNav from "./WishlistNav";

export interface IEventProps {
  accessToken: string
  user: User
  gToken: string
  loggedIn: boolean
  event: IEvent
  participants: IParticipantUser[]
  link: ILink | null
  meParticipant: IParticipant
  myDraw: IParticipant | null
}

export default function Event(props: IEventProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [event, setEvent] = useState(props.event)
  const [meParticipant, setMeParticipant] = useState(props.meParticipant)
  const [link, setLink] = useState(props.link)
  const [participants, setParticipants] = useState(props.participants)
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkError, setLinkError] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const [showDraw, setShowDraw] = useState(false)
  const [linkModal, setLinkModal] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)
  const [leaveGroupModal, setLeaveGroupModal] = useState(true)
  const [myDraw, setMyDraw] = useState(props.myDraw)

  const emailToImageMap = new Map<string, User | null>()
  participants.forEach(p => emailToImageMap.set(p.email, p.user?.imageUrl ? p.user : null))

  const totalParticipants = participants.filter(p => p.participates).length
  const activeParticipants = participants.filter(p => p.participates && p.accepted).length
  const pendingParticipants = totalParticipants - activeParticipants

  const { isOpen, onOpen, onClose } = useDisclosure()

  // Media queries
  const [isMediumScreen] = useMediaQuery('(max-width: 900px)')
  const [isSmallScreen] = useMediaQuery('(max-width: 565px)')
  const [isXSmallScreen] = useMediaQuery('(max-width: 365px)')

  const generateLink = () => {
    setLinkLoading(true);
    setLinkError(false)

    axios.post(`${api.get_link}/${event.id}`,
      { expirationDate: new Date(event.drawAt).toString() },
      { headers: { "Authorization": "Bearer " + accessToken } })
      .then(({ data }: { data: ILink }) => {
        unstable_batchedUpdates(() => {
          setLinkError(false)
          setLinkLoading(false)
          setLink(data)
        })
      })
      .catch(_ => {
        unstable_batchedUpdates(() => {
          setLinkError(true)
          setLinkLoading(false)
        })
      })
  }

  const renderModal = () => {
    if (linkModal) {
      return <GetLinkEvent
        link={link}
        drawDate={event.drawAt}
        linkLoading={linkLoading}
        linkError={linkError}
        onClose={onClose}
        setLinkModal={setLinkModal}
      />
    } else if (showDraw) {
      return (
        <Draws
          setShowDraw={setShowDraw}
          onClose={onClose}
          accessToken={accessToken}
          event={event}
          emailToImageMap={emailToImageMap}
          setMyDraw={setMyDraw}
          meParticipant={meParticipant}
        />
      )
    } else if (wishlist) {
      return (
        <ModalContent>
          <ModalCloseButton onClick={() => {
            setWishlist(false)
            onClose()
          }} />
          <ModalBody>
            <MyWishlist
              event={event}
              accessToken={accessToken}
              meParticipant={meParticipant}
            />
          </ModalBody>
        </ModalContent>
      )
    } else if (settingsModal) {
      return (
        <Settings
          accessToken={accessToken}
          event={event}
          onClose={onClose}
          setSettingsModal={setSettingsModal}
          meParticipant={meParticipant}
          participants={participants}
          setEvent={setEvent}
          setParticipants={setParticipants}
          myDraw={myDraw}
          setMyDraw={setMyDraw}
        />
      )
    } else if (leaveGroupModal) {
      return (
        <LeaveGroup
          accessToken={accessToken}
          event={event}
          onClose={onClose}
          setLeaveGroupModal={setLeaveGroupModal}
          meParticipant={meParticipant}
        />
      )
    }
    return <></>
  }

  const renderMyDraw = () => {
    if (myDraw) {
      const myDrawUser = emailToImageMap.get(myDraw.email)
      return (
        <Box mt='10'>
          <Heading size='md' mb='5'>My Draw</Heading>
          <Box maxW='72'>
            <ParticipantUser
              user={myDrawUser ? myDrawUser : null}
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
      )
    }
    return <></>
  }

  return (
    <>
      <Head>
        <title>{event.name} - GiftTrade</title>
      </Head>

      <Navbar
        loggedIn={loggedIn}
        accessToken={accessToken}
        user={user}
        gToken={gToken}
      />

      <Container maxW='4xl' mb='20'>
        <Flex direction='row'>
          <Container
            flex='2'
            pl='1'
          >
            {!meParticipant.accepted ? (
              <Box mb='5'>
                <PendingInvite
                  event={event}
                  accessToken={accessToken}
                />
              </Box>
            ) : <></>}

            <Box>
              <Stack direction='row' spacing='1' mb='7'>
                {meParticipant.organizer ? (
                  <Badge
                    borderRadius="full"
                    px="2"
                    colorScheme="teal"
                    title={'You are one of the organizers for this event'}
                  >
                    Organizer
                  </Badge>
                ) : <></>}

                {meParticipant.participates ? (
                  <Badge
                    borderRadius="full"
                    px="2"
                    colorScheme="blue"
                    title={'You are a participant for this event'}
                  >
                    Participant
                  </Badge>
                ) : <></>}
              </Stack>

              <Heading size='lg'>{event.name}</Heading>

              <Box mt='1' fontSize='.9em' color='gray.600'>
                <Stack direction='row' spacing='4'>
                  <Text title='Draw date'>
                    <Icon as={BsClock} mr='1' />
                    <span>{moment(event.drawAt).format('ll')}</span>
                  </Text>

                  <Box>
                    <Badge
                      borderRadius="full"
                      px="2"
                      colorScheme="teal"
                      title='Event budget'
                    >
                      {numberToCurrency(event.budget)}
                    </Badge>
                  </Box>

                  <Box
                    d='flext'
                    alignContent='center'
                    justifyContent='center'
                    title={`${activeParticipants}/${totalParticipants} active participants`}
                  >
                    <Icon as={BsFillPeopleFill} mr='2' boxSize='1.1em' />
                    <span>{activeParticipants} / {totalParticipants}</span>
                  </Box>
                </Stack>
              </Box>

              {
                event.description ? (
                  <Text mt='4' color='gray.700'>{event.description}</Text>
                ) : <></>
              }

              <Box mt='5'>
                <Stack direction='row' spacing='2' justifyContent='flex-end'>
                  {meParticipant.organizer ? (
                    <Button
                      leftIcon={<Icon as={BsShuffle} />}
                      size={isXSmallScreen ? 'xs' : 'sm'}
                      colorScheme='blue'
                      onClick={() => {
                        setShowDraw(true)
                        onOpen()
                      }}
                      disabled={!participants.map(v => v.accepted).reduce((prev, cur) => prev && cur) || participants.length < 2}
                    >
                      Draw
                    </Button>
                  ) : <></>}

                  <Button
                    leftIcon={<Icon as={BsLink45Deg} />}
                    size={isXSmallScreen ? 'xs' : 'sm'}
                    colorScheme='teal'
                    onClick={() => {
                      setLinkModal(true)
                      onOpen()
                      if (!link)
                        generateLink()
                    }}
                  >
                    Share Link
                  </Button>

                  {meParticipant.organizer ? (
                    <Button
                      leftIcon={<Icon as={BsGearWideConnected} />}
                      size={isXSmallScreen ? 'xs' : 'sm'}
                      colorScheme='blackAlpha'
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
                      size={isXSmallScreen ? 'xs' : 'sm'}
                      colorScheme='red'
                      onClick={() => {
                        setLeaveGroupModal(true)
                        onOpen()
                      }}
                      variant='ghost'
                    >
                      Leave Group
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>

            {renderMyDraw()}

            <div className={styles.participantsPanel}>
              <Box>
                <Heading size='md' mb='5'>Organizers</Heading>

                <Stack direction='column' spacing={5}>
                  {participants.filter(p => p.organizer).map((p, i) => (
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
                <Heading size='md' mb='5'>Participants</Heading>
                <Stack direction='column' spacing={5}>
                  {participants.filter(p => p.participates).map((p, i) => (
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
          </Container>

          {isMediumScreen ? (
            <></>
          ) : (
            <Container
              flex='1'
              pl='2'
              pr='0'
            >
              <MyWishlist
                event={event}
                accessToken={accessToken}
                meParticipant={meParticipant}
              />
            </Container>
          )}
        </Flex>
      </Container>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setLinkModal(false)
          setShowDraw(false)
          setWishlist(false)
          onClose()
        }}
        size={showDraw ? 'xl' : 'md'}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />

        {renderModal()}
      </Modal>

      <WishlistNav
        setWishlist={setWishlist}
        onOpen={onOpen}
      />
    </>
  )
}