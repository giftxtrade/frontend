import { Box, Stack } from "@chakra-ui/react"

export default function ParticipantUserLoading() {
  const avatarSize = "50px"

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Box>
          <Box
            w={avatarSize}
            h={avatarSize}
            rounded="md"
            className="skeletonLoading"
          />
        </Box>

        <Box overflow="hidden" pr="2">
          <Box className="skeletonLoading" w="90px" h="16px" rounded="md" />

          <Box
            className="skeletonLoading"
            w="126px"
            h="13px"
            mt="1"
            rounded="md"
          />
        </Box>
      </Stack>
    </Box>
  )
}
