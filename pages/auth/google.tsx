import { useRouter } from "next/dist/client/router"
import { Flex, Spinner, Image, Heading, Text, Button, Link, Box } from '@chakra-ui/react';
import { api } from "../../util/api"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Google() {
  const router = useRouter()
  const { code, scope, authuser, prompt } = router.query

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [picture, setPicture] = useState('')
  const [email, setEmail] = useState('')
  const [accessToken, setAT] = useState('')
  const [val, setVal] = useState(false);

  useEffect(() => {
    if (code && scope && authuser && prompt) {
      const requestUri = `${api.google_redirect}?code=${code}&scope=${scope}&authuser=${authuser}&propmt=${prompt}`
      axios.get(requestUri)
        .then(({ data }) => {
          setName(data.user.name)
          setPicture(data.user.imageUrl)
          setEmail(data.user.email)
          setAT(data.accessToken)

          setLoading(false)

          localStorage.setItem('access_token', data.accessToken);
        })
        .catch(err => console.log(err))
    } else {
      setVal(!val)
    }
  }, [val])

  return (
    <>
      {
        loading ? (
          <Flex alignItems="center" justifyContent='center' p='20' >
            <Spinner size='xl' />
          </Flex>
        ) : (
          <>
            <Flex
              direction="row"
              alignItems="center"
              justifyContent='start'
              p='20'
            >
              <Image src={picture} mr='3' rounded='md' />
              <div>
                  <Heading size='md'>{name}</Heading>
                <Text>{email}</Text>

                <Link href="/">
                    <Button size='sm' mt='3'>Logout</Button>
                </Link>
              </div>
            </Flex>

              <Box p='3' overflowX='auto'>
                <Text>Access Token:</Text>
                <pre>{accessToken}</pre>
              </Box>
          </>
        )
      }
    </>
  )
}