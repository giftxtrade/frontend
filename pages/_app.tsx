import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import authenticate from '../util/authenticate';
import Navbar from '../components/Navbar';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const authFunc = async () => {
      setLoggedIn(await authenticate())
    }
    authFunc()
  })

  const gtag = "G-2WM8TF71MK"

  return (
    <>
      <Head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gtag}`} />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtag}');
            `,
          }}
        />
      </Head>

      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
export default MyApp
