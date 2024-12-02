import { ACCESS_TOKEN_KEY, authStore, logout } from "../store/auth-store"
import router from "next/router"
import { Flex, Spinner } from "@chakra-ui/react"
import Head from "next/head"
import { useEffect } from "react"
import { useCookies } from "react-cookie"

export default function Logout() {
  const [_, _setCookie, removeCookie] = useCookies()

  useEffect(() => {
    authStore.dispatch(logout())
    removeCookie(ACCESS_TOKEN_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    sessionStorage.removeItem("invite_code")
    sessionStorage.removeItem("redirect")
    router.push("/")
  }, [])

  return (
    <>
      <Head>
        <title>Logging out...</title>
      </Head>

      <Flex alignItems="center" justifyContent="center" p="20">
        <Spinner size="xl" />
      </Flex>
    </>
  )
}
