import { useState } from "react";
import {
  Flex,
  Spinner,
  Image,
  Heading,
  Text,
  Button,
  Link,
  Box,
  Container,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  useDisclosure
} from '@chakra-ui/react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { DocumentContext } from "next/document";
import { serverSideAuth } from "../util/server-side-auth";
import Search from "../components/Search";
import { BsPlusCircle } from 'react-icons/bs'
import { NewEvent } from "../components/NewEvent";

export default function Home(props: any) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn)
  const [accessToken, setAccessToken] = useState(props.accessToken)
  const [gToken, setGToken] = useState(props.gToken)
  const [user, setUser] = useState(props.user)

  // Modal
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Head>
        <title>Home - GiftTrade</title>
      </Head>

      <Navbar
        loggedIn={loggedIn}
        accessToken={accessToken}
        user={user}
        gToken={gToken}
      />

      <Container maxW='4xl'>
        <Flex direction='row'>
          <Container
            flex='2'
            p='1'
          >
            <Flex direction='row' alignItems='center' justifyContent='start'>
              <Heading size='lg' m='0' p='0' mt='1.5'>My Events</Heading>

              <Button
                size='lg'
                p='0'
                ml='5'
                variant="ghost"
                colorScheme='blue'
                spacing='sm'
                onClick={onOpen}
              >
                <Icon as={BsPlusCircle} boxSize='1.5em' />
              </Button>
            </Flex>
          </Container>

          <Container
            flex='1'
            pl='2'
            pr='0'
          >
          </Container>
        </Flex>
      </Container>

      <NewEvent
        isOpen={isOpen}
        onClose={onClose}
        accessToken={accessToken}
        user={user}
      />
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => await serverSideAuth(ctx);