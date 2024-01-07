import { DocumentContext } from 'next/document';
import { Flex, Text, Button, useToast } from "@chakra-ui/react"
import { api } from "../../util/api"
import { useState } from "react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { base } from "../../util/site"
import { Link, Participant } from "@giftxtrade/api-types"
import { GetServerSidePropsResult } from "next"
import { authStore } from "../../store/auth-store"
import moment from "moment"

export default function Invite(details: Link) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { inviteCode } = router.query
  const { token } = authStore.getState()
  const toast = useToast()
  const [linkExpired, setLinkExpired] = useState(
    !moment().isSameOrBefore(details.expiration_date),
  )

  const title = `${details.event?.name} Invite - GiftTrade`
  const description =
    details.event?.description !== ""
      ? details.event?.description
      : `Click the link to join ${details?.event?.name} with simple one click login.`

  const accept = () => {
    setLoading(true)
    axios
      .get(`${api.join_event}/${details.code}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res: AxiosResponse<Participant>) => {
        setTimeout(
          () =>
            router.push(`/events/${details.event?.id}/${details.event?.slug}`),
          2000,
        )
        let title = `You've joined ${details.event?.name}`
        if (res.status !== 201) {
          title = `You are already a participant in ${details.event?.name}`
        }
        toast({
          title: title,
          description: "You'll be redirected to the event shortly.",
          status: "success",
          isClosable: true,
          variant: "subtle",
        })
      })
      .catch(({ response }: AxiosError<Link>) => {
        if (response?.status === 401) {
          setTimeout(
            () => router.push(`/login?redirect=/i/${details.code}`),
            2000,
          )
          toast({
            title: "Login required",
            description:
              "Once you have successfully logged in you will be allowed to enter the event",
            status: "error",
            isClosable: false,
          })
          return
        }
        setLoading(false)
        setLinkExpired(true)
      })
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta name="robots" content="noindex" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`${base}i/${inviteCode}`} />
        <meta property="og:site_name" content="GiftTrade" />
      </Head>

      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        p="20"
      >
        {linkExpired ? (
          <>
            <Text mb="5" fontSize="3xl">
              Invite link for <b>{details.event?.name}</b> has been expired
            </Text>

            <Button mt="5" onClick={() => router.push("/home")}>
              Back to home
            </Button>
          </>
        ) : (
          <>
            <Text mb="5" fontSize="3xl">
              Would you like to participate in <b>{details.event?.name}</b>?
            </Text>

            <Flex mt="5" alignItems="center" justifyContent="center">
              <Button onClick={accept} isLoading={loading} colorScheme="blue">
                Yes, I'm in
              </Button>
              <Text ml="4" mr="4">
                or
              </Text>
              <Button onClick={() => router.push("/home")} disabled={loading}>
                Cancel
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </>
  )
}

export const getServerSideProps = async (
  ctx: DocumentContext,
): Promise<GetServerSidePropsResult<Link>> => {
  const inviteCode = ctx.query.inviteCode

  let details: Link = {} as Link
  let error = false
  await axios
    .get(`${api.verify_invite_code}/${inviteCode}`)
    .then(({ data }: AxiosResponse<Link>) => {
      details = data
    })
    .catch((_) => {
      error = true
    })

  return !error
    ? {
        props: {
          ...details,
        },
      }
    : {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      }
}