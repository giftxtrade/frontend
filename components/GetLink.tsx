import {
  Flex,
  Button,
  Input,
  Text,
} from '@chakra-ui/react'
import { base } from '../util/site'
import { InfoIcon, CopyIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export default function GetLink({ link, drawDate }: { link: string, drawDate: string }) {
  const [copy, setCopy] = useState(false);

  return (
    <>
      <Flex>
        <Input
          value={`${base}i/${link}`}
          variant='filled'
        />
        <Button
          leftIcon={<CopyIcon />}
          ml='3'
          onClick={() => {
            navigator.clipboard.writeText(`${base}i/${link}`)
            setCopy(true)
          }}
          colorScheme='teal'
        >
          {copy ? 'Copied' : 'Copy'}
        </Button>
      </Flex>

      <Text mt='5' fontSize='sm' color='gray.600'>
        <InfoIcon mr='2' />
        You can use the generated link to share with anyone that you want to have in your event. This link is set to deactivate on <i>{new Date(drawDate).toDateString()}</i>.
      </Text>
    </>
  )
}