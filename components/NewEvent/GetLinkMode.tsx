import { InfoIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Text,
  Button,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Flex
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';
import { base } from '../../util/site';
import GetLink from '../GetLink';
import { IParticipantForm } from '../NewEvent';

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
}

export default function GetLinkMode({ linkLoading, error, link, drawDate, setMain, setGetLink, setBudget, setName, setDrawDate, setDescription, setReset, onClose }: IGetLinkMode) {
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

          <ModalFooter mt='7'>
            <Button colorScheme='blue' mr={3} onClick={() => {
              setMain(true)
              setGetLink(false)
              setBudget(0)
              setName('')
              setDrawDate('')
              setDescription('')
                setReset(false)
              onClose()
            }}>
              Done
            </Button>
          </ModalFooter>
        </>
      )}

    </ModalContent>
  )
}