import { IParticipant } from '../types/Participant';
import { useState } from 'react';
import { Heading } from '@chakra-ui/react';
import {
  Box,
  Stack,
  Input,
  Icon,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  IconButton
} from '@chakra-ui/react'
import axios from 'axios';
import { api } from '../util/api';
import { BsArrowRightShort, BsBullseye, BsGeo } from 'react-icons/bs';

export interface IAddAddressProps {
  meParticipant: IParticipant
  accessToken: string
}

export default function AddAddress({ meParticipant, accessToken }: IAddAddressProps) {
  const [address, setAddress] = useState(meParticipant.address)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  return (
    <>
      <FormControl id="email">
        <FormLabel fontWeight='bold'>Address</FormLabel>

        <Stack spacing='2' direction='row'>
          <Input
            name='addressInput'
            value={address}
            placeholder='Add your address'
            onChange={e => setAddress(e.target.value)}
          />

          <Button
            loading={loading}
            onClick={() => {
              navigator.geolocation.getCurrentPosition(pos => {
                console.log(`Lat: ${pos.coords.latitude}`)
                console.log(`Lon: ${pos.coords.longitude}`)
              });
            }}
            title='Use my current location'
          >
            <Icon boxSize='5' as={BsGeo} />
          </Button>

          <Button
            loading={loading}
            onClick={() => {
              setLoading(true)
              axios.patch(`${api.participants}/${meParticipant.id}`, { address: address }, {
                headers: { "Authorization": "Bearer " + accessToken }
              })
                .then(({ data }) => {
                  setLoading(false)
                })
                .catch(err => {
                  console.log(err)
                  setLoading(false)
                })
            }}
            colorScheme='blue'
            title='Update address'
          >
            <Icon boxSize='7' as={BsArrowRightShort} />
          </Button>
        </Stack>
      </FormControl>
    </>
  )
}