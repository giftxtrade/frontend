import { Container, Image, Flex, Heading, Text, Link, Box } from "@chakra-ui/react";
import JwtPayload from '../store/jwt-payload';
import router from "next/router";
import { useMediaQuery } from '@chakra-ui/react'
import NextLink from 'next/link';
import styles from '../styles/Navbar.module.css';
import { changeProfileSize } from '../util/content';

export interface INavbarProps extends JwtPayload {
  loggedIn: boolean
}

export default function Navbar({ loggedIn, user, accessToken, gToken }: INavbarProps) {
  const [isSmallScreen] = useMediaQuery('(max-width: 370px)')

  return (
    <Container maxW="4xl" p="5" mb="10">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <NextLink href="/home" passHref>
          <Link>
            <span className={styles.logo}></span>
          </Link>
        </NextLink>

        <Flex
          direction="row"
          alignItems="center"
          justifyContent="start"
          cursor="pointer"
          ml="2"
          onClick={() => {
            router.push("/logout");
          }}
        >
          <Image
            src={
              user?.imageUrl
                ? changeProfileSize(user.imageUrl, 50)
                : "default.jpg"
            }
            w="35px"
            mr="2"
            rounded="md"
          />
          <Box>
            <Heading size="xs">{user?.name}</Heading>
            {isSmallScreen ? (
              <></>
            ) : (
              <Text fontSize="10" color="gray.600">
                {user?.email}
              </Text>
            )}
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
}