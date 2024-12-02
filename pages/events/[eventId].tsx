"use client"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { api } from "../../util/api"
import { authStore } from "../../store/auth-store"
import { Event } from "@giftxtrade/api-types"
import { eventNameSlug } from "../../util/links"
import ErrorBlock from "../../components/ErrorBlock"
import { BsExclamationCircle } from "react-icons/bs"
import { Icon } from "@chakra-ui/react"
import { Head } from "next/document"
import LoadingScreen from "../../components/LoadingScreen"

export default function EventIdPage() {
  const router = useRouter()
  const { eventId } = router.query
  const [eventNotFound, setEventNotFound] = useState(false)

  useEffect(() => {
    if (!eventId || typeof eventId !== "string") return

    const authState = authStore.getState()
    axios
      .get<Event>(`${api.events}/${eventId}?verify=true`, {
        headers: { Authorization: `Bearer ${authState.token}` },
      })
      .then(({ data: event }) => {
        router.push(
          `/events/${eventId}/${event.slug ?? eventNameSlug(event.name)}`,
        )
      })
      .catch((_err) => {
        setEventNotFound(true)
        router.push("/home")
      })
  }, [eventId])

  if (eventNotFound) {
    return (
      <ErrorBlock
        message="Event could not be found"
        icon={<Icon as={BsExclamationCircle} boxSize="20" mb="7" />}
      />
    )
  }

  return (
    <>
      <Head>
        <title>GiftTrade</title>
      </Head>

      <LoadingScreen />
    </>
  )
}
