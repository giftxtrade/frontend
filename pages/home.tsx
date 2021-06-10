import { Component, useState, useEffect } from "react";
import { User } from '../store/jwt-payload';
import { authStore, logout } from '../store/auth-store';
import { useRouter } from 'next/router'
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import { useCookies } from 'react-cookie';
import Navbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(true)
  const [accessToken, setAccessToken] = useState('')
  const [gToken, setGToken] = useState('')
  const [user, setUser] = useState({ id: 0, name: '', email: '', imageUrl: '' })
  const [val, setVal] = useState(false)
  const [cookie, setCookie, removeCookie] = useCookies(['access_token'])

  useEffect(() => {
    authStore.subscribe(() => {
      const { loggedIn, gToken, user, accessToken } = authStore.getState()
      setLoggedIn(loggedIn)
      setAccessToken(accessToken)
      setGToken(gToken)
      setUser(user)
    })

    if (!loggedIn)
      router.push('/')
  }, [val])

  return (
    <>
      <Head>
        <title>Home - GiftXTrade</title>
      </Head>

      <Container maxW='4xl'>
        <Navbar />

        <Flex
          direction="row"
          alignItems="center"
          justifyContent='start'
        >
          <Image src={user.imageUrl} mr='3' rounded='md' />
          <div>
            <Heading size='md'>{user.name}</Heading>
            <Text>{user.email}</Text>

            <Link href="/">
              <Button
                size='sm'
                mt='3'
                onClick={() => {
                  authStore.dispatch(logout())
                  removeCookie('access_token')
                  router.push('/')
                }}
              >
                Logout
              </Button>
            </Link>
          </div>
        </Flex>
      </Container>
    </>
  )
}