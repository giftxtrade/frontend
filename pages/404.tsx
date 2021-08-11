import {
  Heading,
  Text,
  Button,
  Box,
  Container,
  Icon,
  Link
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { BsChevronLeft } from 'react-icons/bs';
import BackButton from '../components/BackButton';

export default function PageNotFound() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>404 Page Not Found - GiftTrade</title>
      </Head>

      <Container
        mt='10' mb='10'
      >
        <Heading textAlign='center' mb='5'>404</Heading>

        <Text fontWeight='bold' textAlign='center'>
          The page you were looking for could not be found
        </Text>

        <Text mt='3'>
          If what you were looking for is an event, it might have been deleted or you might not be a part of the event.
        </Text>

        <Box mt='5'>
          <BackButton
            href="/"
            value="Back to Home"
          />
        </Box>
      </Container>
    </>
  )
}