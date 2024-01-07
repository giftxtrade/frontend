import NextLink from "next/link"
import {
  Box,
  Stack,
  Badge,
  Image,
  Heading,
  Text,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react"
import { Event, Participant } from "@giftxtrade/api-types"

export interface IParticipantUserProps extends Participant {
  event: Event
}

export default function ParticipantUser({
  id,
  name,
  email,
  accepted,
  user,
  event,
}: IParticipantUserProps) {
  const avatarSize = "50px"
  const link = `/events/${event.id}/${event?.slug}/${id}`

  return (
    <Box>
      <NextLink href={link} passHref>
        <LinkBox cursor="pointer">
          <Stack direction="row" spacing={2}>
            <Box>
              {user ? (
                <Image
                  src={user.imageUrl}
                  w={avatarSize}
                  maxW={avatarSize}
                  rounded="md"
                  bg="gray.300"
                />
              ) : (
                <Box
                  w={avatarSize}
                  h={avatarSize}
                  bg="gray.300"
                  rounded="md"
                ></Box>
              )}
            </Box>

            <Box overflow="hidden" pr="2">
              {!accepted ? (
                <Badge
                  borderRadius="full"
                  colorScheme="red"
                  title="User hasn't accepted the invite yet"
                  mb="0.5"
                  fontSize=".6em"
                >
                  Pending
                </Badge>
              ) : (
                <></>
              )}

              <Heading size="xs">
                <LinkOverlay href={link}>
                  {user
                    ? user.name === name
                      ? name
                      : `${name} (${user.name})`
                    : `${name}`}
                </LinkOverlay>
              </Heading>
              <Text fontSize=".7em" color="gray.600">
                {email}
              </Text>
            </Box>
          </Stack>
        </LinkBox>
      </NextLink>
    </Box>
  )
}
