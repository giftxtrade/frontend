import { Text, Heading, Container, Box, Image } from '@chakra-ui/react'
import Head from 'next/head';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy and Terms of Service - GiftTrade</title>
      </Head>

      <Container pt='10' pb='10'>
        <Box mb='14'>
          <Image w='36' src='/giftxtrade_logotype_color.svg' />
        </Box>

        <Box mb='5'>
          <Heading size='lg'>Privacy and Terms of Service</Heading>
          <Text><small>Version: July 8, 2021</small></Text>
        </Box>

        <Box>
          <Text>
            GiftTrade is a free service that aims to make it easy for friends and family with creating and managing gift exchange events.
          </Text>

          <br />

          <Text>
            Our team at GiftTrade truly believes in a safe and secure web. As a result, we make sure to clearly explain how GiftTrade displays, manages, and stores user data.
          </Text>
        </Box>
      </Container>
    </>
  )
}