import { useState } from "react";
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box, Container } from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { DocumentContext } from "next/document";
import { serverSideAuth } from "../util/server-side-auth";
import Search from "../components/Search";

export default function Home(props: any) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)

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
        <Flex
          direction='row'
        >
          <Search
            accessToken={accessToken}
            minPrice={0}
            maxPrice={50}
            pageLimit={50}
          />

          <Container
            flex='1'
            pl='2'
            pr='0'
          >
            <Text>My wish list</Text>
          </Container>
        </Flex>
      </Container>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => await serverSideAuth(ctx);