import { useState } from "react";
import { useRouter } from 'next/router'
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { DocumentContext } from "next/document";
import { serverSideAuth } from "../util/server-side-auth";

export default function Home(props: any) {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)
  const [val, setVal] = useState(false)

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
        <h1>{props.user.name}</h1>
        <Text>No organizations</Text>
      </Container>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => await serverSideAuth(ctx);