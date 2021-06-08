import { useRouter } from "next/dist/client/router"
import { Flex, Spinner, Image, Heading, Text, Button, Link } from '@chakra-ui/react';
import { api } from "../../util/api"
import axios from "axios"
import { useState } from "react"

export default function Google() {
  const router = useRouter()
  const { code, scope, authuser, prompt } = router.query

  const [loading, setLoading] = useState(false)
  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')
  const [picture, setPicture] = useState('')
  const [email, setEmail] = useState('')

  if (code && scope && authuser && prompt) {
    const requestUri = `${api.google_redirect}?code=${code}&scope=${scope}&authuser=${authuser}&propmt=${prompt}`
    axios.get(requestUri)
      .then(({ data }) => {
        setFName(data.user.firstName)
        setLName(data.user.lastName)
        setPicture(data.user.picture)
        setEmail(data.user.email)

        setLoading(false)
      })
      .catch(err => console.log(err))
  }

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
                <Heading>{fName} {lName}</Heading>
                <Text>{email}</Text>

                <Link href="/">
                  <Button mt='3'>Logout</Button>
                </Link>
              </div>
            </Flex>
          </>
        )
      }
    </>
  )
}