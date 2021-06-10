import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import authenticate from '../util/authenticate';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const authFunc = async () => {
      setLoggedIn(await authenticate())
    }
    authFunc()
  })

  return (
    <ChakraProvider>
      {
        loggedIn ? <Navbar /> : <></>
      }

      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
