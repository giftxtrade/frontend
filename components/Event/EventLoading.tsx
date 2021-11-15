import { Box, Stack } from "@chakra-ui/react";
import styles from "../../styles/eventId.module.css"
import ParticipantUserLoading from "../ParticipantUserLoading"

export default function EventLoading() {
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Box className="skeletonLoading" w="95px" h="18px" rounded="lg" />
        <Box className="skeletonLoading" w="95px" h="18px" rounded="lg" />
      </Stack>

      <Box className="skeletonLoading" maxW="sm" h="32px" mt="7" rounded="md" />
      <Box className="skeletonLoading" w="120px" h="20px" mt="2" rounded="md" />

      <Box
        className="skeletonLoading"
        maxW="80%"
        h="17px"
        mt="3"
        rounded="md"
      />
      <Box
        className="skeletonLoading"
        maxW="57%"
        h="17px"
        mt="1"
        rounded="md"
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end" mt="5">
        <Box className="skeletonLoading" w="85px" h="28px" rounded="lg" />
        <Box className="skeletonLoading" w="85px" h="28px" rounded="lg" />
      </Stack>

      <div className={styles.participantsPanel}>
        <Box>
          <Box
            className="skeletonLoading"
            w="105px"
            h="21px"
            mb="5"
            rounded="lg"
          />

          <Stack direction="column" spacing={5}>
            <ParticipantUserLoading />
          </Stack>
        </Box>

        <Box>
          <Box
            className="skeletonLoading"
            w="115px"
            h="21px"
            mb="5"
            rounded="lg"
          />

          <Stack direction="column" spacing={5}>
            <ParticipantUserLoading />
            <ParticipantUserLoading />
            <ParticipantUserLoading />
            <ParticipantUserLoading />
          </Stack>
        </Box>
      </div>
    </Box>
  )
}
