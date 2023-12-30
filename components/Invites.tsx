import {
  Box,
  Heading,
  Text,
  Badge,
  Spinner,
  Button,
  Stack,
} from "@chakra-ui/react"
import EventBoxSm from "./EventBoxSm"
import { Event, User } from "@giftxtrade/api-types"

export interface IInvitesProps {
  invites: Event[]
  handleAccept: (eventId: number) => void
  handleDecline: (eventId: number) => void
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