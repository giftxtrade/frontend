import { IParticipant } from '../types/Participant';
import { useState } from 'react';
import { Heading, useToast } from '@chakra-ui/react';
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
import { unstable_batchedUpdates } from 'react-dom';

export interface IAddAddressProps {
  meParticipant: IParticipant
  accessToken: string
}

export default function AddAddress({ meParticipant, accessToken }: IAddAddressProps) {
  const [address, setAddress] = useState(meParticipant.address)
  const [loading, setLoading] = useState(false)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [error, setError] = useState(false)

  const toast = useToast()

  const updateAddress = (myAddress: string) => {
    setLoading(true)
    axios.patch(`${api.participants}/${meParticipant.id}`, { address: myAddress }, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }) => {
        toast({
          title: "Address updated!",
          description: myAddress,
          status: "success",
          duration: 2000,
          isClosable: true,
          variant: 'subtle'
        })
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

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
            isLoading={loadingLocation}
            onClick={() => {
              setLoadingLocation(true)
              navigator.geolocation.getCurrentPosition(
                pos => {
                  const { latitude, longitude } = pos.coords
                  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDf_L_C6EXCZlD4XNhZOdF0aENCzRASmhI`)
                    .then(({ data }: any) => {
                      const myAddress = data.results[0].formatted_address
                      unstable_batchedUpdates(() => {
                        setAddress(myAddress)
                        setLoadingLocation(false)
                      })
                      updateAddress(myAddress)
                    })
                    .catch(err => {
                      toast({
                        title: "Something went wrong",
                        description: "Please reload and try again",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        variant: 'subtle'
                      })
                      setLoadingLocation(false)
                    })
                },
                err => {
                  toast({
                    title: "Could not fetch address",
                    description: "We were unable to detect your address using the location service on your device. Try using the input box to enter your address manually.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    variant: 'subtle'
                  })
                  setLoadingLocation(false)
                }
              );
            }}
            title='Use my current location'
          >
            <Icon boxSize='5' as={BsGeo} />
          </Button>

          <Button
            isLoading={loading}
            onClick={() => updateAddress(address)}
            colorScheme='blue'
            title='Update address'
            disabled={address.length === 0}
          >
            <Icon boxSize='7' as={BsArrowRightShort} />
          </Button>
        </Stack>
      </FormControl>
    </>
  )
}