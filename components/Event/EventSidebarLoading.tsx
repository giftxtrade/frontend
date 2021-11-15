import { Box, Flex } from "@chakra-ui/react"
import { WishlistLoadingItem } from "../WishlistItem"

function EventSidebarLoading() {
  return (
    <>
      <Flex mb="5" direction="row" alignItems="center" justifyContent="start">
        <Box
          className="skeletonLoading"
          w="111px"
          h="24px"
          mb="5"
          rounded="lg"
          mt="1.5"
        />
      </Flex>

      <Box overflow="hidden">
        {[1, 2].map((p, i) => (
          <Box mb="5" key={`loading#${i}`}>
            <WishlistLoadingItem />
          </Box>
        ))}
      </Box>
    </>
  )
}

export default EventSidebarLoading
