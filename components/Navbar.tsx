import { Container, Image, Flex, Heading, Text, Link, Button, Box } from "@chakra-ui/react";
import { User } from '../store/jwt-payload';
import { authStore, logout } from '../store/auth-store';
import router from "next/router";
import { useCookies } from "react-cookie";

export default function Navbar({ loggedIn, user, accessToken, gToken }: {
  loggedIn: boolean,
  user: User,
  accessToken: string,
  gToken: string
}) {
  const [cookie, setCookie, removeCookie] = useCookies(['access_token'])

  return (
    <Container maxW='4xl' p='5' mb='10'>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Image w='40' src='/giftxtrade_logotype_color.svg' />

        <Flex
          direction="row"
          alignItems="center"
          justifyContent='start'
          cursor='pointer'
          onClick={() => {
            removeCookie('access_token')
            authStore.dispatch(logout())
            router.push('/')
          }}
        >
          <Image src={user.imageUrl} w='35px' mr='3' rounded='md' />
          <Box>
            <Heading size='xs'>{user.name}</Heading>
            <Text fontSize='10'>{user.email}</Text>
          </Box>
        </Flex>
      </Flex>
    </Container>
  )
}