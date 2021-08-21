import { IParticipantUser } from '../types/Participant';
import NextLink from 'next/link';
import { User } from '../store/jwt-payload';
import {
  Box,
  Stack,
  Badge,
  Image,
  Heading,
  Text,
  LinkBox,
  LinkOverlay
} from "@chakra-ui/react"
import { IEvent } from '../types/Event';
import { eventNameSlug } from '../util/links';

export interface IParticipantUserProps {
  id: number
  name: string
  email: string
  address: string
  organizer: boolean
  participates: boolean
  accepted: boolean
  user: User | null
  event: IEvent
}

export default function ParticipantUser({ id, name, email, address, organizer, participates, accepted, user, event }: IParticipantUserProps) {
  const avatarSize = '50px'
  const link = `/events/${event.id}/${eventNameSlug(event.name)}/${id}`

  return (
    <Box>
      <NextLink href={link} passHref>
        <LinkBox cursor='pointer'>
          <Stack direction='row' spacing={2}>
            <Box>
              {user ? (
                <Image src={user.imageUrl} w={avatarSize} maxW={avatarSize} rounded='md' />
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
                <LinkOverlay href={link}>
                  {user ? (
                    user.name === name ?
                      name
                      : `${name} (${user.name})`
                  ) : `${name}`}
                </LinkOverlay>
              </Heading>
              <Text fontSize='.7em'>{email}</Text>
            </Box>
          </Stack>
        </LinkBox>
      </NextLink>
    </Box>
  )
}