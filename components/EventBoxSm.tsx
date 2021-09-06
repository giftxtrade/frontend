import { IEvent, IEventUser } from '../types/Event'
import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  Stack,
  Flex,
  Icon,
  LinkOverlay
} from '@chakra-ui/react'
import moment from 'moment'
import { BsCheck, BsX, BsClock } from 'react-icons/bs';
import { Link } from '@chakra-ui/react';
import { eventNameSlug } from '../util/links';
import { User } from '../store/jwt-payload';
import ParticipantsMini from './ParticipantsMini';

export interface IEventBoxSmProps {
  event: IEventUser
  isInvite: boolean
  index: number
  user: User
  handleAccept: (eventId: number, index: number) => void
  handleDecline: (eventId: number, index: number) => void
}

export default function EventBoxSm({ event, isInvite, handleAccept, handleDecline, index, user }: IEventBoxSmProps) {
  const eventUrl = `/events/${event.id}/${eventNameSlug(event.name)}`;
  const meParticipant = event.participants.find(e => e.email === user?.email);

  return (
    <Box
      maxW="full"
      borderWidth="1px" borderRadius="lg" borderColor='gray.100'
      overflow="hidden"
      p='5'
      backgroundColor={isInvite ? '#f9f9f9' : 'white'}
    >
      {isInvite ? (
        <Heading size='md'>
          <Link href={eventUrl}>
            {event.name}
          </Link>
        </Heading>
      ) : (
          <LinkOverlay href={eventUrl}>
            <Heading size='md'>
              {event.name}
            </Heading>
          </LinkOverlay>
      )}

      <Text color='gray.500' fontSize='xs' mb='1' title='Draw date'>
        <Icon as={BsClock} mr='1' />
        <span>{moment(event.drawAt).format('ll')}</span>
      </Text>

      {isInvite || event.participants.length <= 1 ? <></> : (
        <Box mt='1' mb='3'>
          <ParticipantsMini participants={event?.participants} />
        </Box>
      )}

      {
        event.description ? (
          <Text>{event.description}</Text>
        ) : <></>
      }

      <Stack direction='row' spacing='1' mt='2'>
        {meParticipant?.organizer ? (
          <Badge
            borderRadius="full"
            px="2"
            colorScheme="teal"
            title={'You ' + (isInvite ? 'will be' : 'are') + ' one of the organizers for this event'}
          >
            Organizer
          </Badge>
        ) : <></>}

        {meParticipant?.participates ? (
          <Badge
            borderRadius="full"
            px="2"
            colorScheme="blue"
            title={'You ' + (isInvite ? 'will be a' : 'are a') + ' participant for this event'}
          >
            Participant
          </Badge>
        ) : <></>}
      </Stack>

      {isInvite ? (
        <Stack direction='row' alignItems='center' justifyContent='flex-end' spacing='3' mt='4'>
          <Button
            size='xs'
            colorScheme='green'
            title='Accept this event invite'
            onClick={() => handleAccept(event.id, index)}
            leftIcon={<Icon as={BsCheck} boxSize='4' />}
          >
            Accept
          </Button>

          <Button
            size='xs'
            colorScheme='red'
            variant='ghost'
            title='Decline this event invite'
            onClick={() => handleDecline(event.id, index)}
            leftIcon={<Icon as={BsX} boxSize='4' />}
          >
            Decline
          </Button>
        </Stack>
      ) : <></>}
    </Box>
  )
}