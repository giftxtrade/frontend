import { useRouter } from "next/dist/client/router"
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box } from '@chakra-ui/react';
import { api } from "../../util/api"
import axios from "axios"
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { DocumentContext } from "next/document";
import { redirectHomeIfLoggedIn } from "../../util/server-side-auth";
import Head from 'next/head';
import PageLoader from '../../components/PageLoader';
import { toStringOrNull, toStringOrUndefined } from '../../util/content';

export interface IGoogleProps {
  code: string | null
  scope: string | null
  authuser: string | null
  prompt: string | null
}

export default function Google({ code, scope, authuser, prompt }: IGoogleProps) {
  const router = useRouter()

  const [error, setError] = useState(false)
  const [cookie, setCookie] = useCookies(['access_token'])

  useEffect(() => {
    if (code && scope && authuser && prompt) {
      const requestUri = `${api.google_redirect}?code=${code}&scope=${scope}&authuser=${authuser}&propmt=${prompt}`

      axios.get(requestUri)
        .then(({ data }) => {
          setError(false)
          localStorage.setItem('access_token', data.accessToken);
          setCookie('access_token', data.accessToken, {
            maxAge: 2000 * 3600,
            sameSite: 'lax',
            path: '/'
          })

          const redirect = localStorage.getItem('redirect')

          const inviteCode = localStorage.getItem('invite_code')
          if (inviteCode) {
            axios.get(`${api.invite_code}/${inviteCode}`, { headers: { "Authorization": "Bearer " + data.accessToken } })
              .then(({ data }) => {
                localStorage.removeItem('invite_code')
                router.push('/home')
              })
              .catch(_ => setError(true))
          } else {
            localStorage.removeItem('redirect')
            router.push(redirect ? redirect : '/home')
          }
        })
        .catch(err => {
          setError(true)
        })
    } else {
      setError(true)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Logging in...</title>
      </Head>

      {
        error ? (
          <Flex alignItems="center" justifyContent='center' p='20' >
            <Text>Something went wrong, please try logging in <Link color='blue.600' href={api.google} fontWeight='bold'>again</Link></Text>
          </Flex>
        ) : <PageLoader />
      }
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const code = ctx.query?.code;
  const scope = ctx.query?.scope;
  const authuser = ctx.query?.authuser;
  const prompt = ctx.query?.prompt;
  return {
    props: {
      code: toStringOrNull(code),
      scope: toStringOrNull(scope),
      authuser: toStringOrNull(authuser),
      prompt: toStringOrNull(prompt),
    }
  }
};