import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import authenticate from '../util/authenticate';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    authenticate()
  })

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
