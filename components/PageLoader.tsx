import { Flex, Spinner } from '@chakra-ui/react';

export default function PageLoader() {
  return (
    <Flex alignItems="center" justifyContent='center' p='20' >
      <Spinner size='xl' />
    </Flex>
  )
}