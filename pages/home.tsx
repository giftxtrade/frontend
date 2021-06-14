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
  }, [val])

  useEffect(() => {
    console.log(loggedIn)
    if (!loggedIn || !localStorage.getItem('access_token'))
      router.push('/')
  })

  return (
    <>
      <Head>
        <title>Home - Gift. Trade</title>
      </Head>

      <Navbar
        loggedIn={loggedIn}
        accessToken={accessToken}
        user={user}
        gToken={gToken}
      />

      <Container maxW='4xl'>
        <Text>No organizations</Text>
      </Container>
    </>
  )
}