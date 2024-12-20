import { api } from '../util/api';
import Head from 'next/head';
import PageLoader from '../components/PageLoader';
import { useEffect, useState } from "react"
import { useRouter } from 'next/router';
import { DocumentContext } from 'next/document';
import { toStringOrNull } from '../util/content';
import { useGoogleLogin } from "@react-oauth/google"
import axios, { AxiosResponse } from "axios"
import { ACCESS_TOKEN_KEY, authStore, login } from "../store/auth-store"
import { Flex, Link } from "@chakra-ui/react"
import { Auth } from "@giftxtrade/api-types"
import { useCookies } from "react-cookie"

export default function Login(props: { redirect: string | null }) {
  const router = useRouter()
  const [error, setError] = useState(false)
  const [_, setCookie] = useCookies()

  const oauth = useGoogleLogin({
    onSuccess: (token) => {
      const requestUri = `${api.google_verify}?access_token=${token.access_token}`

      axios
        .get(requestUri)
        .then(({ data }: AxiosResponse<Auth>) => {
          setCookie(ACCESS_TOKEN_KEY, data.token)
          authStore.dispatch(
            login({
              user: data.user,
              token: data.token,
            }),
          )

          const redirect = sessionStorage.getItem("redirect")?.trim() || ""
          sessionStorage.removeItem("redirect")
          router.push(redirect !== "" ? redirect : "/home")
        })
        .catch((_) => setError(true))
    },
  })

  useEffect(() => {
    if (props.redirect) {
      sessionStorage.setItem("redirect", props.redirect)
    }
    oauth()
  }, [])

  return (
    <>
      <Head>
        <title>Login - GiftTrade</title>
      </Head>

      {error ? (
        <Flex alignItems="center" justifyContent="center" p="20">
          <p>
            Something went wrong, please try logging in{" "}
            <Link
              color="blue.600"
              href="#"
              fontWeight="bold"
              onClick={() => oauth()}
            >
              again
            </Link>
          </p>
        </Flex>
      ) : (
        <PageLoader />
      )}
    </>
  )
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const redirect = ctx.query?.redirect;
  return { props: { redirect: toStringOrNull(redirect) } }
};