import { Flex, Spinner, Text, Link } from '@chakra-ui/react';
import { api } from "../../util/api"
import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import NextLink from 'next/link';

export default function Invite() {
  const [error, setError] = useState(false)
  const [val, setVal] = useState(false)
  const router = useRouter()
  const { inviteCode } = router.query

  useEffect(() => {
    if (inviteCode) {
      axios.get(`${api.verify_invite_code}/${inviteCode}`)
        .then(({ data }) => {
          localStorage.setItem('invite_code', data.code)
          router.push(api.google)
        })
        .catch(_ => setError(true))
    } else {
      setVal(!val)
    }
  }, [val])

  return (
    <>
      {
        error ? (
          <Flex direction='column' alignItems="center" justifyContent='center' p='20' >
            <Text mb='5'>Something went wrong. Perhaps the invite link was expired, or non-existent.</Text>

            <NextLink href={'/'} passHref>
              <Link color='blue.600' fontWeight='bold'>Head to the homepage</Link>
            </NextLink>
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