import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import authenticate from '../util/authenticate';
import Head from 'next/head';
import { content } from '../util/content';
import { base } from '../util/site';
import '../styles/main.css';
import '../public/fonts/fonts.css';
import Footer from '../components/Footer';
import '../styles/main.css'
import { useRouter } from "next/dist/client/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) {
      const authFunc = async () => {
        setLoggedIn(await authenticate());
      };
      authFunc();
      console.log("Fired!");
    }
  });

  return (
    <>
      <Head>
        <title>{content.BASE_TITLE}</title>

        <link rel="icon" href="/favicon.ico" />

        <meta name="description" content={content.DESCRIPTION} />

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

      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>

      <Footer />
    </>
  );
}
export default MyApp
