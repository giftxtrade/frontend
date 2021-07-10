import { DocumentContext } from 'next/document';
import { Flex, Spinner, Text, Link } from '@chakra-ui/react';
import { api } from "../../util/api"
import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import Head from 'next/head';
import { base } from '../../util/site';

export default function Invite(props: { details: { name: string, description: string } | null }) {
  const [details, setDetails] = useState(props.details)
  const [error, setError] = useState(false)
  const router = useRouter()
  const { inviteCode } = router.query

  useEffect(() => {
    if (details) {
      axios.get(`${api.verify_invite_code}/${inviteCode}`)
        .then(({ data }) => {
          localStorage.setItem('invite_code', data.code)
          router.push(api.google)
        })
        .catch(_ => setError(true))
    } else {
      setError(true)
    }
  }, [])

  const renderSuccess = () => {
    const title = `${details?.name} Invite - GiftTrade`
    const description = details?.description !== '' ?
      details?.description :
      `Click the link to join ${details?.name} with simple one click login.`

    return (
      <>
        <Head>
          <title>{details?.name} Invite - GiftTrade</title>
          <meta name="description" content={description} />

          <meta name="robots" content="noindex" />

          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:url" content={`${base}i/${inviteCode}`} />
          <meta property="og:site_name" content="GiftTrade" />
        </Head>

        <Flex alignItems="center" justifyContent='center' p='20' >
          <Spinner size='xl' />
        </Flex>
      </>
    )
  }

  return (
    <>
      {
        error || !details ? (
          <Flex direction='column' alignItems="center" justifyContent='center' p='20' >
            <Text mb='5'>Something went wrong. Perhaps the invite link was expired, or non-existent.</Text>

            <NextLink href={'/'} passHref>
              <Link color='blue.600' fontWeight='bold'>Head to the homepage</Link>
            </NextLink>
          </Flex>
        ) : renderSuccess()
      }
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const inviteCode = ctx.query.inviteCode;

  let details: { name: string, description: string } | undefined;
  await axios.get(`${api.eventDetails}/${inviteCode}`)
    .then(({ data }: { data: { name: string, description: string } }) => {
      details = data
    })
    .catch(_ => {
      details = undefined
    })

  return { props: { details: details ? details : null } }
};