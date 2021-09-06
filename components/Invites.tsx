import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  Button,
  Stack,
} from '@chakra-ui/react'
import { User } from '../store/jwt-payload'
import { IEventUser } from '../types/Event'
import EventBoxSm from './EventBoxSm'

export interface IInvitesProps {
  invites: IEventUser[]
  handleAccept: (eventId: number, index: number) => void
  handleDecline: (eventId: number, index: number) => void
  user: User
}

export default function Invites({ invites, handleAccept, handleDecline, user }: IInvitesProps) {
  return (
    <Box mb='10'>

      <Heading size='md' mb='3'>
        Invites
        <Badge
          ml='3'
          fontSize="0.7em"
          pt='1' pb='1' pl='2' pr='2'
          colorScheme="blue"
        >
          {invites.length}
        </Badge>
      </Heading>

      <Stack spacing='2' maxW='sm'>
        {invites.map((e, i) => (
          <EventBoxSm
            event={e}
            isInvite={true}
            key={`invite#${i}`}
            handleAccept={handleAccept}
            handleDecline={handleDecline}
            index={i}
            user={user}
          />
        ))}
      </Stack>

    </Box>
  )
}