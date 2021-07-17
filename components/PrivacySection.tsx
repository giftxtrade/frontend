import * as CSS from "csstype";
import { Text, Heading, Container, Box, Image } from '@chakra-ui/react'
import { Token } from '@chakra-ui/styled-system/dist/types/utils';
import { ReactElement } from 'react'

export function PrivacySection({ heading, text, textSpacing }: {
  heading: string | null,
  text: ReactElement[],
  textSpacing?: Token<CSS.Property.MarginBottom | number, "space">
}) {
  return (
    <Box>
      {heading ? (
        <Heading size='md' mb='3'>{heading}</Heading>
      ) : <></>}

      {text.map((t, i) => (
        <Text mb={i === (text.length - 1) ? '0' : (textSpacing ? textSpacing : '3')}>
          {t}
        </Text>
      ))}
    </Box>
  )
}