import {
  Heading,
  Text,
  Button,
  Box,
  Icon,
  Badge,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import moment from "moment";
import numberToCurrency from "../util/currency";
import { BsClock, BsFillPeopleFill, BsFillPersonDashFill, BsGearWideConnected, BsLink45Deg, BsShuffle } from "react-icons/bs";
import PendingInvite from './PendingInvite';
import { IParticipantUser } from '../types/Participant';
import { IEventFull } from '../types/Event';
import axios from 'axios';
import { api } from '../util/api';
import { ILink } from '../types/Link';
import { unstable_batchedUpdates } from 'react-dom';
import { Dispatch, SetStateAction } from 'react';

export interface IEventHeaderProps {
  meParticipant: IParticipantUser
  event: IEventFull
  accessToken: string
  participants: IParticipantUser[]
  link: ILink | undefined

  setLeaveGroupModal: Dispatch<SetStateAction<boolean>>
  onOpen: () => void
  setSettingsModal: Dispatch<SetStateAction<boolean>>
  setLinkModal: Dispatch<SetStateAction<boolean>>
  setLinkError: Dispatch<SetStateAction<boolean>>
  setLinkLoading: Dispatch<SetStateAction<boolean>>
  setLink: Dispatch<SetStateAction<ILink | undefined>>
  setShowDraw: Dispatch<SetStateAction<boolean>>
}

export default function EventHeader({
  meParticipant,
  event,
  accessToken,
  participants,
  setLeaveGroupModal,
  onOpen,
  setSettingsModal,
  setLinkModal,
  setLinkError,
  setLinkLoading,
  setLink,
  link,
  setShowDraw
}: IEventHeaderProps) {
  const totalParticipants = participants.filter(p => p.participates).length
  const activeParticipants = participants.filter(p => p.participates && p.accepted).length
  const pendingParticipants = totalParticipants - activeParticipants

  const [isXSmallScreen] = useMediaQuery('(max-width: 365px)')

  const generateLink = () => {
    setLinkLoading(true);
    setLinkError(false)

    if (!event)
      return;

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

  return (
    <>
      {
        !meParticipant.accepted ? (
          <Box mb='5'>
            <PendingInvite
              event={event}
              accessToken={accessToken}
            />
          </Box>
        ) : <></>
      }

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
      </Box></>
  )
}