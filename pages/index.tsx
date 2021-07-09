import { Button, Container, Link, Image, Flex, Heading, Text, Box, Spinner } from '@chakra-ui/react';
import axios from 'axios'
import { useRouter } from 'next/dist/client/router';
import { DocumentContext } from 'next/document';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import { authStore } from '../store/auth-store';
import styles from '../styles/landing-page.module.css'
import cookie, { serialize } from "cookie"
import { redirectHomeIfLoggedIn } from '../util/server-side-auth';
import { api } from '../util/api';

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    authStore.subscribe(() => setLoggedIn(authStore.getState().loggedIn))
    setLoading(false)

    if (loggedIn) {
      router.push('/home')
    }
  })

  return (
    <>
      <Head>
        <title>GiftTrade - Gift Exchange, Secret Santa Generator</title>
      </Head>

      <Container maxW='full' p='0'>
        {
          loading ? (
            <Flex alignItems="center" justifyContent='center' p='20' >
              <Spinner size='md' />
            </Flex>
          ) : (
              <Container p='0' maxW='full' h='100vh' className={styles.landingPageHero}>
                <Flex
                  direction='row'
                  alignItems='center'
                  justifyContent='center'
                  className={styles.landingNav}
                >
                  <Image w='48' src='/giftxtrade_logotype_color.svg' />
                </Flex>

                <Container maxW='5xl' className={styles.landingContent}>
                  <Box pt='20' pb='20'>
                    <Heading size='2xl' mb='7'>Gift Exchange. Made Simple.</Heading>
                    <Text color='gray.800' fontSize='xl'>
                      Setting up gift exchanges can be difficult, so we made the proccess simple.
                    </Text>
                    <Text color='gray.800' fontSize='xl'>
                      With simple Google sign-in and contacts integration, setting up <i>your</i> secret santa is only a few clicks away.
                    </Text>

                    <Container maxW='full' p='0' mt='5vh'>
                      <Link href={`${api.google}`}>
                        <Button colorScheme='red' size='lg'>Start your Gift Exchange!</Button>
                      </Link>
                    </Container>
                  </Box>
                </Container>
              </Container>
          )
        }
      </Container>
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => await redirectHomeIfLoggedIn(ctx);
