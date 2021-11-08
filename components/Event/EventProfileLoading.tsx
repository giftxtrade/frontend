import EventContainer from "./EventContainer"
import { Box, Stack, useMediaQuery } from "@chakra-ui/react"
import { WishlistLoadingItem } from "../WishlistItem"

const SidebarLoading = () => {
  return (
    <>
      <Box className="skeletonLoading" w="55%" h="24px" mb="5" rounded="md" />

      <Box mb="3">
        <WishlistLoadingItem />
      </Box>

      <Box mb="3">
        <WishlistLoadingItem />
      </Box>
    </>
  )
}

const EventProfileLoading = () => {
  const [isMediumScreen] = useMediaQuery("(max-width: 900px)")
  const [isSmallScreen] = useMediaQuery("(max-width: 500px)")

  const avatarSize = isSmallScreen ? "70px" : "100px"

  return (
    <EventContainer
      primary={
        <>
          <Box
            className="skeletonLoading"
            w="158px"
            h="32px"
            mb="5"
            rounded="md"
          />

          <Box mt="5" w="full">
            <Stack spacing="4" mt="5" direction="row" w="full">
              <Box maxW={avatarSize}>
                <Box
                  className="skeletonLoading"
                  w={avatarSize}
                  maxW={avatarSize}
                  h={avatarSize}
                  rounded="xl"
                />
              </Box>

              <Box w="full">
                <Box
                  className="skeletonLoading"
                  w="70%"
                  h="36px"
                  rounded="md"
                  mb="2"
                />
                <Box
                  className="skeletonLoading"
                  w="45%"
                  h="13px"
                  rounded="lg"
                  mb="2"
                />

                <Box
                  className="skeletonLoading"
                  w="95px"
                  h="18px"
                  rounded="lg"
                  mb="2"
                ></Box>

                <Box
                  className="skeletonLoading"
                  w="30%"
                  h="22px"
                  rounded="lg"
                ></Box>
              </Box>
            </Stack>
          </Box>

          {isMediumScreen ? (
            <Box mt="14">
              <SidebarLoading />
            </Box>
          ) : (
            <></>
          )}
        </>
      }
      sidebar={<SidebarLoading />}
    />
  )
}

export default EventProfileLoading
