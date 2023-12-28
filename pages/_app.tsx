import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from "react"
import authenticate from "../util/authenticate"
import Head from "next/head"
import { content } from "../util/content"
import "../styles/main.css"
import "../public/fonts/fonts.css"
import Footer from "../components/Footer"
import LoadingScreen from "../components/LoadingScreen"
import { GoogleOAuthProvider } from "@react-oauth/google"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

function MyApp({ Component, pageProps }: AppProps) {
  // Set true if auth state is initialized
  const [init, setInit] = useState(false)

  const authFunc = async () => {
    if (!init) {
      await authenticate()
      setInit(true)
    }
  }

  useEffect(() => {
    authFunc()
  }, [])

  const invitePageDescription =
    pageProps.details?.description !== ""
      ? pageProps.details?.description
      : `Click the link to join ${pageProps.details?.name} with simple one click login.`

  return (
    <>
      <Head>
        {pageProps?.details ? (
          <title>{pageProps.details?.name} Invite - GiftTrade</title>
        ) : (
          <title>{content.BASE_TITLE}</title>
        )}

        <link rel="icon" href="/favicon.ico" />

        {pageProps?.details ? (
          <meta name="description" content={invitePageDescription} />
        ) : (
          <meta name="description" content={content.DESCRIPTION} />
        )}

        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/maskable_icon_x96.png" />
        <meta name="apple-mobile-web-app-status-bar" content="#ffffff" />

        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${content.GTAG}`}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${content.GTAG}');
            `,
          }}
        />
      </Head>

      {init ? (
        <>
          <ChakraProvider>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <Component {...pageProps} />
            </GoogleOAuthProvider>
          </ChakraProvider>

          <Footer />
        </>
      ) : (
        <LoadingScreen />
      )}
    </>
  )
}
export default MyApp
