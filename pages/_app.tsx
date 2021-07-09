import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import authenticate from '../util/authenticate';
import Head from 'next/head';
import { content } from '../util/content';
import { base } from '../util/site';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const authFunc = async () => {
      setLoggedIn(await authenticate())
    }
    authFunc()
  })

  return (
    <>
      <Head>
        <title>{content.BASE_TITLE}</title>

        <link rel="icon" href="/favicon.ico" />

        <meta name="description" content={content.DESCRIPTION} />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content={content.BASE_TITLE} />
        <meta property="og:description" content={content.DESCRIPTION} />
        <meta property="og:image" content={`${base}banner.jpg`} />
        <meta property="og:url" content={base} />
        <meta property="og:site_name" content="GiftTrade" />

        <script async src={`https://www.googletagmanager.com/gtag/js?id=${content.GTAG}`} />

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

      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  )
}
export default MyApp
