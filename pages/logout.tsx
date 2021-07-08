import { authStore, logout } from '../store/auth-store';
import router from "next/router";
import { useCookies } from "react-cookie";
import { Flex, Spinner } from '@chakra-ui/react'
import Head from 'next/head';
import { useEffect } from 'react';
import { serialize } from 'cookie';
import { DocumentContext } from 'next/document';

export default function Logout() {
  const [cookie, setCookie, removeCookie] = useCookies(['access_token'])
  useEffect(() => {
    authStore.dispatch(logout())
    setTimeout(() => router.push('/'), 1000)
  }, [])

  return (
    <>
      <Head>
        <title>Logging out...</title>
      </Head>

      <Flex alignItems="center" justifyContent='center' p='20' >
        <Spinner size='xl' />
      </Flex>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  if (ctx.res) {
    ctx.res.setHeader('Set-Cookie', [
      serialize('access_token', '', {
        maxAge: -1,
        path: '/',
      }),
    ])
  }
  return { props: {} }
};