import { IEvent } from '../types/Event'
import {
  Box,
  Heading,
  Text,
  Button,
  Badge,
  Stack,
  Flex,
  Icon,
} from '@chakra-ui/react'
import moment from 'moment'
import { BsCheck, BsX } from 'react-icons/bs'

export interface IEventBoxSmProps {
  event: IEvent,
  isInvite: boolean,
}

export default function EventBoxSm({ event, isInvite }: IEventBoxSmProps) {
  return (
    <Box
      maxW="full"
      borderWidth="1px" borderRadius="lg"
      overflow="hidden"
      p='5'
    >
      {
        isInvite ? (
          <Box mb='1'>
            <Text fontSize='sm' color='gray.400'>Pending invite</Text>
          </Box>
        ) : <></>
      }

      <Heading size='md'>
        {event.name}
      </Heading>

      <Text color='gray.500' fontSize='xs'>
        <b>Created on:</b> {moment(event.createdAt).format('LL')}
      </Text>

      {
        event.description ? (
          <Text>{event.description}</Text>
        ) : <></>
      }

      <Stack direction='row' spacing='1' mt='2'>
        {event.participants[0].organizer ? (
          <Badge
            borderRadius="full"
            px="2"
            colorScheme="teal"
            title={'You ' + (isInvite ? 'will be' : 'are') + ' one of the organizers for this event'}
          >
            Organizer
          </Badge>
        ) : <></>}

        {event.participants[0].participates ? (
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
        <Flex direction='row' alignItems='center' justifyContent='end'>
          <Button
            size='xs'
            colorScheme='green'
            variant='ghost'
            title='Accept this event invite'
          >
            <Icon as={BsCheck} boxSize='5' />
          </Button>

          <Button
            size='xs'
            colorScheme='red'
            variant='ghost'
            ml='4'
            title='Decline this event invite'
          >
            <Icon as={BsX} boxSize='5' />
          </Button>
        </Flex>
      ) : <></>}
    </Box>
  )
}