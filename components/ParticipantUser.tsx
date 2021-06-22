import { IParticipantUser } from '../types/Participant';
import {
  Box,
  Stack,
  Badge,
  Image,
  Heading,
  Text
} from "@chakra-ui/react"

export default function ParticipantUser({ user, name, email, accepted, participates, organizer }: IParticipantUser) {
  const avatarSize = '50px';
  return (
    <Box>
      <Stack direction='row' spacing={2}>
        <Box>
          {user ? (
            <Image src={user.imageUrl} w={avatarSize} rounded='md' />
          ) : (
              <Box w={avatarSize} h={avatarSize} bg='gray.300' rounded='md'></Box>
          )}
        </Box>

        <Box overflow='hidden'>
          {!accepted ? (
            <Badge
              borderRadius="full"
              colorScheme="red"
              title="User hasn't accepted the invite yet"
              mb='0.5'
              fontSize='.6em'
            >
              Pending
            </Badge>
          ) : <></>}

          <Heading size='xs'>
            {user ? (
              user.name === name ?
                name
                : `${name} (${user.name})`
            ) : `${name}`}
          </Heading>
          <Text fontSize='.7em'>{email}</Text>
        </Box>
      </Stack>
    </Box>
  )
}