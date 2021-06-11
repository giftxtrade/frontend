import { Container, Image, Flex, Heading, Text, Link, Button, Box } from "@chakra-ui/react";
import { User } from '../store/jwt-payload';
import { authStore, logout } from '../store/auth-store';
import router from "next/router";

export default function Navbar({ loggedIn, user, accessToken, gToken }: {
  loggedIn: boolean,
  user: User,
  accessToken: string,
  gToken: string
}) {
  return (
    <Container maxW='4xl' p='5' mb='10'>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Image w='48' src='/giftxtrade_logo_color.svg' />

        <Flex
          direction="row"
          alignItems="center"
          justifyContent='start'
          cursor='pointer'
          onClick={() => {
            authStore.dispatch(logout())
            // router.push('/')
          }}
        >
          <Image src={user.imageUrl} w='40px' mr='3' rounded='md' />
          <Box>
            <Heading size='sm'>{user.name}</Heading>
            <Text fontSize='xs'>{user.email}</Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  )
}