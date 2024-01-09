import { useState } from "react"
import axios, { AxiosResponse } from "axios"
import { api } from "../util/api"
import { useRouter } from "next/router"
import { Event } from "@giftxtrade/api-types"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Text,
  Box,
  Stack,
  Button,
} from "@chakra-ui/react"

export default function PendingInvite({
  event,
  accessToken,
}: {
  accessToken: string
  event: Event
}) {
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  return (
    <Alert status="error" rounded="lg">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>Invite Pending!</AlertTitle>
        <AlertDescription display="block">
          <Text>
            You haven't accepted the invite for this event. Make sure to press
            "Accept" to access all feature for this event.
          </Text>

          <Stack mt="3" direction="row" spacing="4" justifyContent="flex-end">
            <Button
              onClick={() => {
                setLoading(true)
                axios
                  .get(`${api.accept_invite}/${event.id}`, {
                    headers: { Authorization: "Bearer " + accessToken },
                  })
                  .then((_res: AxiosResponse<Event>) => {
                    router.reload()
                  })
                  .catch((_) => setLoading(false))
              }}
              size="sm"
              isLoading={loading}
            >
              Accept Invite
            </Button>

            <Button
              onClick={() => {
                setLoading(true)
                axios
                  .get(`${api.decline_invite}/${event.id}`, {
                    headers: { Authorization: "Bearer " + accessToken },
                  })
                  .then(({ data }) => router.push("/home"))
                  .catch((_) => setLoading(false))
              }}
              size="sm"
              colorScheme="red"
              isLoading={loading}
            >
              Decline
            </Button>
          </Stack>
        </AlertDescription>
      </Box>
    </Alert>
  )
}
