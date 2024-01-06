import { DocumentContext } from 'next/document';
import { Flex, Text, Button } from "@chakra-ui/react"
import { api } from "../../util/api"
import { useState } from "react"
import axios, { AxiosResponse } from "axios"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import { base } from "../../util/site"
import { Link } from "@giftxtrade/api-types"
import { GetServerSidePropsResult } from "next"

export default function Invite(details: Link) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { inviteCode } = router.query

  const title = `${details.event?.name} Invite - GiftTrade`
  const description =
    details.event?.description !== ""
      ? details.event?.description
      : `Click the link to join ${details?.event?.name} with simple one click login.`

  const accept = () => {
    setLoading(true)
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