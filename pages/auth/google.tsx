import { useRouter } from "next/dist/client/router"
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box } from '@chakra-ui/react';
import { api } from "../../util/api"
import axios from "axios"
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';

export default function Google() {
  const router = useRouter()
  const { code, scope, authuser, prompt } = router.query

  const [error, setError] = useState(false)
  const [val, setVal] = useState(false)
  const [cookie, setCookie] = useCookies(['access_token'])

  useEffect(() => {
    if (code && scope && authuser && prompt) {
      const requestUri = `${api.google_redirect}?code=${code}&scope=${scope}&authuser=${authuser}&propmt=${prompt}`
      axios.get(requestUri)
        .then(({ data }) => {
          setError(false)
          localStorage.setItem('access_token', data.accessToken);
          setCookie('access_token', data.accessToken)
          router.push('/home')
        })
        .catch(err => {
          setError(true)
        })
    } else {
      setVal(!val)
    }
  }, [val])

  return (
    <>
      {
        error ? (
          <Flex alignItems="center" justifyContent='center' p='20' >
            <Text>Something went wrong, please try logging in <Link color='blue.600' href={api.google} fontWeight='bold'>again</Link></Text>
          </Flex>
        ) : (
            <Flex alignItems="center" justifyContent='center' p='20' >
              <Spinner size='xl' />
            </Flex>
        )
      }
    </>
  )
}