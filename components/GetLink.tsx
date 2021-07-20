import {
  Flex,
  Button,
  Input,
  Text,
} from '@chakra-ui/react'
import { base } from '../util/site'
import { InfoIcon, CopyIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import moment from "moment";

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
        This link is set to deactivate on <b><i>{moment(drawDate).format('ll')}</i></b>. To change the expiration date, update the event draw date.
      </Text>
    </>
  )
}