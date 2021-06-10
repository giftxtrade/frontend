import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import axios from 'axios';
import { api } from '../util/api';
import { authStore, login, logout } from '../store/auth-store';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken || accessToken.trim() === '')
      return

    axios.get(api.profile, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(({ data }) => {
        authStore.dispatch(login({
          accessToken: accessToken,
          user: data.user,
          gToken: data.gToken
        }))
      })
      .catch(_ => {
        authStore.dispatch(logout())
        console.log('You were logged out!')
      })
  })

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
export default MyApp
