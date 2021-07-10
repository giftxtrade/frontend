import { DocumentContext } from 'next/document';
import { Flex, Spinner, Text, Link } from '@chakra-ui/react';
import { api } from "../../util/api"
import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';
import Head from 'next/head';

export default function Invite(props: { details: { name: string, description: string } | undefined }) {
  const [error, setError] = useState(false)
  const [val, setVal] = useState(false)
  const router = useRouter()
  const { inviteCode } = router.query

  useEffect(() => {
    if (inviteCode) {
      axios.get(`${api.verify_invite_code}/${inviteCode}`)
        .then(({ data }) => {
          localStorage.setItem('invite_code', data.code)
          router.push(api.google)
        })
        .catch(_ => setError(true))
    } else {
      setVal(!val)
    }
  }, [val])

  return (
    <>
      {props.details ? (
        <Head>
          <title>{props.details.name} Invite - GiftTrade</title>
          <meta name="description" content={
            props.details.description !== '' ?
              props.details.description :
              `Click the link to join ${props.details.name} with simple one click login.`
          } />
        </Head>
      ) : <></>}

      {
        error ? (
          <Flex direction='column' alignItems="center" justifyContent='center' p='20' >
            <Text mb='5'>Something went wrong. Perhaps the invite link was expired, or non-existent.</Text>

            <NextLink href={'/'} passHref>
              <Link color='blue.600' fontWeight='bold'>Head to the homepage</Link>
            </NextLink>
          </Flex>
        ) : (
          <Flex alignItems="center" justifyContent='center' p='20' >
            <Spinner size='xl' />
          </Flex>
        )
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

  return { props: { details } }
};