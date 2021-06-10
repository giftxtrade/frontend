import { Container, Image, Flex } from "@chakra-ui/react";

export default function Navbar({ auth }: any) {
  return (
    <Container maxW='4xl' p='5' mb='10'>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Image w='48' src='/giftxtrade_logo_color.svg' />
      </Flex>
    </Container>
  )
}