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

  return (
    <>
      <Head>
        <title>{content.BASE_TITLE}</title>

        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={content.DESCRIPTION} />

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
            <Component {...pageProps} />
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
