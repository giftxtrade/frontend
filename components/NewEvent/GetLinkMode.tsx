import {
  Text,
  Button,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Flex,
  ModalCloseButton
} from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';
import GetLink from '../GetLink';
import { IEventUser } from '../../types/Event';

export interface IGetLinkMode {
  setMain: Dispatch<SetStateAction<boolean>>
  setName: Dispatch<SetStateAction<string>>
  setDescription: Dispatch<SetStateAction<string>>
  setBudget: Dispatch<SetStateAction<number>>
  drawDate: string
  setDrawDate: Dispatch<SetStateAction<string>>
  error: boolean
  setReset: Dispatch<SetStateAction<boolean>>
  setGetLink: Dispatch<SetStateAction<boolean>>
  linkLoading: boolean
  link: string
  onClose: () => void

  redirectToEvent: (event: IEventUser) => void
  event: IEventUser | undefined
}

export default function GetLinkMode({ linkLoading, error, link, drawDate, setMain, setGetLink, setBudget, setName, setDrawDate, setDescription, setReset, onClose, redirectToEvent, event }: IGetLinkMode) {
  const [redirectLoading, setRedirectLoading] = useState(false)

  return (
    <ModalContent>
      {linkLoading ? (
        <Flex
          maxW='full'
          direction='column'
          alignItems='center'
          justifyContent='center'
          mt='5' mb='5'
          p='5'
        >
          <Spinner mb='5' />
          <Text textAlign='center'>Generating sharable link. Please wait.</Text>
        </Flex>
      ) : (
        <>
          <ModalHeader>Get Link</ModalHeader>

            <ModalCloseButton onClick={() => {
              setMain(true)
              setGetLink(false)
              setBudget(0)
              setName('')
              setDrawDate('')
              setDescription('')
              setReset(false)
              onClose()
            }} />

          <ModalBody>
            {error ? (
              <Alert status="error" mt='7' rounded='md'>
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>Could not generate your link</AlertDescription>
              </Alert>
            ) : (
                  <GetLink
                    link={link}
                    drawDate={drawDate}
                  />
            )}
          </ModalBody>

            <ModalFooter pr='3'>
              <Button
                colorScheme='blue'
                pl='6'
                pr='6'

                onClick={() => {
                  setRedirectLoading(true)
                  setMain(true)
                  setGetLink(false)
                  setBudget(0)
                  setName('')
                  setDrawDate('')
                  setDescription('')
                  setReset(false)
                  onClose()

                  if (event) {
                    redirectToEvent(event)
                  } else {
                    setRedirectLoading(false)
                  }
                }}
                isLoading={redirectLoading}
              >
              Done
            </Button>
          </ModalFooter>
        </>
      )}

    </ModalContent>
  )
}