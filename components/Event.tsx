import { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Box,
  Container,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useMediaQuery
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from './Navbar';
import axios from 'axios';
import { api } from '../util/api';
import { IEventFull, IEventDetails } from '../types/Event';
import { IParticipantUser } from '../types/Participant';
import { User } from "../store/jwt-payload";
import { ILink } from '../types/Link';
import ParticipantUser from './ParticipantUser';
import GetLinkEvent from './GetLinkEvent';
import { unstable_batchedUpdates } from "react-dom";
import MyWishlist from './MyWishlist';
import Draws from './Draws';
import Settings from './Settings';
import LeaveGroup from './LeaveGroup';
import styles from '../styles/eventId.module.css'
import WishlistNav from "./WishlistNav";
import EventHeader from "./EventHeader";
import { IDraw, IDrawParticipant } from '../types/Draw';

export interface IEventProps {
  accessToken: string
  user: User
  gToken: string
  loggedIn: boolean
  eventDetails: IEventDetails
}

export default function Event(props: IEventProps) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)

  const [event, setEvent] = useState<IEventFull>()
  const [meParticipant, setMeParticipant] = useState<IParticipantUser>()
  const [link, setLink] = useState<ILink>()
  const [participants, setParticipants] = useState<IParticipantUser[]>()
  const [myDraw, setMyDraw] = useState<IParticipantUser>()

  const [loading, setLoading] = useState(true)
  const [linkLoading, setLinkLoading] = useState(false)
  const [linkError, setLinkError] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const [showDraw, setShowDraw] = useState(false)
  const [linkModal, setLinkModal] = useState(false)
  const [settingsModal, setSettingsModal] = useState(false)
  const [leaveGroupModal, setLeaveGroupModal] = useState(true)

  const { isOpen, onOpen, onClose } = useDisclosure()

  // Media queries
  const [isMediumScreen] = useMediaQuery('(max-width: 900px)')

  useEffect(() => {
    axios.get(
      `${api.events}/${props.eventDetails.id}`,
      { headers: { "Authorization": "Bearer " + accessToken } }
    )
      .then(({ data }: { data: IEventFull }) => {
        unstable_batchedUpdates(() => {
          setEvent({ ...data })
          setLink(data.links.length > 0 ? { ...data.links[0] } : undefined)
          setParticipants([...data.participants])
          setMeParticipant(data.participants.find(p => p.user?.email === user.email))
        })

        axios.get(`${api.draws}/me/${data.id}`, {
          headers: { "Authorization": "Bearer " + accessToken }
        })
          .then(({ data }: { data: IDrawParticipant }) => {
            unstable_batchedUpdates(() => {
              setLoading(false)
              setMyDraw(data.drawee)
            })
          })
          .catch(err => {
            unstable_batchedUpdates(() => {
              setLoading(false)
            })
          })
      })
      .catch(_ => {
        console.log("Could not load event")
      })
  }, [])


  const renderModal = () => {
    if (!event || !meParticipant || !participants)
      return;

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
              eventDetails={props.eventDetails}
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
    if (!loading && myDraw && event) {
      return (
        <Box mt='10'>
          <Heading size='md' mb='5'>My Draw</Heading>
          <Box maxW='72'>
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
      )
    }
    return <></>
  }

  return (
    <>
      <Head>
        <title>{props.eventDetails.name} - GiftTrade</title>

        {props.eventDetails.description.length > 0 ? (
          <meta name="description" content={props.eventDetails.description} />
        ) : (
          <meta name="description" content={props.eventDetails.name} />
        )}
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
            {!loading && event && participants && meParticipant ? (
              <EventHeader
                meParticipant={meParticipant}
                event={event}
                accessToken={accessToken}
                participants={participants}
                link={link}
                setLeaveGroupModal={setLeaveGroupModal}
                onOpen={onOpen}
                setSettingsModal={setSettingsModal}
                setLinkModal={setLinkError}
                setLinkError={setLinkError}
                setLinkLoading={setLinkLoading}
                setLink={setLink}
                setShowDraw={setShowDraw}
              />
            ) : (
              <Box>
                  <Stack direction='row' spacing={2}>
                    <Box className='skeletonLoading' w='95px' h='18px' rounded='lg'></Box>
                    <Box className='skeletonLoading' w='95px' h='18px' rounded='lg'></Box>
                  </Stack>

                  <Box className='skeletonLoading' maxW='sm' h='32px' mt='7' rounded='md'></Box>
                  <Box className='skeletonLoading' w='120px' h='20px' mt='2' rounded='md'></Box>

                  <Box className='skeletonLoading' maxW='80%' h='17px' mt='3' rounded='md'></Box>
                  <Box className='skeletonLoading' maxW='57%' h='17px' mt='1' rounded='md'></Box>

                  <Stack direction='row' spacing={2} justifyContent='flex-end' mt='5'>
                    <Box className='skeletonLoading' w='85px' h='28px' rounded='lg'></Box>
                    <Box className='skeletonLoading' w='85px' h='28px' rounded='lg'></Box>
                  </Stack>
                </Box>
            )}

            {renderMyDraw()}

            <div className={styles.participantsPanel}>
              {!loading && event && participants && meParticipant ? (
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
              ) : <></>}

              {!loading && event && participants && meParticipant ? (
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
              ) : <></>}
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
                  eventDetails={props.eventDetails}
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