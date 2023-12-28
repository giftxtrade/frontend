import {
  Container,
  Image,
  Flex,
  Heading,
  Text,
  Link,
  Box,
} from "@chakra-ui/react"
import { useMediaQuery } from "@chakra-ui/react"
import NextLink from "next/link"
import styles from "../styles/Navbar.module.css"
import { changeProfileSize } from "../util/content"
import { authStore } from "../store/auth-store"

export default function Navbar() {
  const [isSmallScreen] = useMediaQuery("(max-width: 370px)")
  const { user } = authStore.getState()

  return (
    <Container maxW="4xl" p="5" mb="10">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <NextLink href="/home" passHref>
          <Link>
            <span className={styles.logo}></span>
          </Link>
        </NextLink>

        <NextLink href="/logout">
          <a>
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="start"
              cursor="pointer"
              ml="2"
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
          </a>
        </NextLink>
      </Flex>
    </Container>
  )
}
