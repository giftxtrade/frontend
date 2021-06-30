import { useState } from "react";
import {
  Flex,
  Spinner,
  Image,
  Heading,
  Text,
  Button,
  Link,
  Box,
  Container,
  Icon,
  Badge,
  Stack,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { DocumentContext } from "next/document";
import { serverSideAuth } from "../../util/server-side-auth";
import axios from 'axios';
import { api } from '../../util/api';
import { IEvent } from '../../types/Event';
import { useMediaQuery } from 'react-responsive';
import { IParticipant, IParticipantUser } from '../../types/Participant';
import moment from "moment";
import numberToCurrency from "../../util/currency";
import { BsBagFill, BsClock, BsFillPeopleFill, BsGearWideConnected, BsLink45Deg, BsShuffle } from "react-icons/bs";
import { User } from "../../store/jwt-payload";
import { ILink } from '../../types/Link';
import ParticipantUser from '../../components/ParticipantUser';
import GetLinkEvent from '../../components/GetLinkEvent';
import { unstable_batchedUpdates } from "react-dom";
import MyWishlist from "../../components/MyWishlist";
import eventFetch from "../../util/ss-event-fetch";

export interface IEventProps {
  accessToken: string
  user: User
  gToken: string
  loggedIn: boolean
  event: IEvent
  participants: IParticipantUser[],
  link: ILink | null
  meParticipant: IParticipant
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

  const totalParticipants = participants.filter(p => p.participates).length
  const activeParticipants = participants.filter(p => p.participates && p.accepted).length
  const pendingParticipants = totalParticipants - activeParticipants

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [linkModal, setLinkModal] = useState(false)

  // Media queries
  const isMediumScreen = useMediaQuery({ query: '(max-device-width: 900px)' })
  const isSmallScreen = useMediaQuery({ query: '(max-device-width: 565px)' })
  const isXSmallScreen = useMediaQuery({ query: '(max-device-width: 365px)' })

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
    }

    if (wishlist) {
      return (
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <MyWishlist
              event={event}
              accessToken={accessToken}
              meParticipant={meParticipant}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              onClose()
              setLinkModal(false)
            }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
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
                  <Text title='Created on'>
                    <Icon as={BsClock} mr='1' />
                    <span>{moment(event.createdAt).format('ll')}</span>
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
                  <Text mt='4'>{event.description}</Text>
                ) : <></>
              }

              <Box mt='5'>
                <Stack direction='row' spacing='2' justifyContent='flex-end'>
                  <Button
                    leftIcon={<Icon as={BsShuffle} />}
                    size={isXSmallScreen ? 'xs' : 'sm'}
                    colorScheme='blue'
                  >
                    Draw
                  </Button>

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

                  <Button
                    leftIcon={<Icon as={BsGearWideConnected} />}
                    size={isXSmallScreen ? 'xs' : 'sm'}
                    colorScheme='blackAlpha'
                  >
                    Settings
                  </Button>
                </Stack>
              </Box>
            </Box>

            <SimpleGrid columns={isSmallScreen ? 1 : 2} spacing={10} mt='14'>
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
                      key={`participant#${i}`}
                    />
                  ))}
                </Stack>
              </Box>
            </SimpleGrid>
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

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        {renderModal()}
      </Modal>

      {isMediumScreen ? (
        <Flex
          w='full' maxW='full'
          p='2' pb='5'
          position='fixed'
          bottom='0' left='0' z-index='4'
          alignItems='center'
          justifyContent='center'
          onClick={() => {
            setWishlist(true)
            onOpen()
          }}
        >
          <Button boxShadow='dark-lg' colorScheme='red' size='lg' rounded='full' p='1'>
            <Icon as={BsBagFill} />
          </Button>
        </Flex>
      ) : <></>}
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => eventFetch(ctx);