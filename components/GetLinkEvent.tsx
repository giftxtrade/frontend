import GetLink from './GetLink';
import { ILink } from '../types/Link';
import {
  Flex,
  Spinner,
  Text,
  Button,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

export interface IGetLinkEvent {
  link: ILink | null
  drawDate: string
  linkLoading: boolean
  linkError: boolean
  onClose: () => void
  setLinkModal: Dispatch<SetStateAction<boolean>>
}

export default function GetLinkEvent({ link, drawDate, linkLoading, linkError, onClose, setLinkModal }: IGetLinkEvent) {
  return (
    <ModalContent>
      <ModalHeader>Get Link</ModalHeader>
      <ModalCloseButton onClick={() => {
        setLinkModal(false)
        onClose()
      }} />
      <ModalBody>
        {link ? (
          <GetLink
            link={link.code}
            drawDate={drawDate}
          />
        ) : (
          linkLoading ? (
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
            linkError ? (
              <Alert status="error" mt='3' rounded='md'>
                <AlertIcon />
                <AlertTitle mr={2}>Error!</AlertTitle>
                <AlertDescription>Could not generate your link</AlertDescription>
              </Alert>
            ) : <></>
          )
        )}
      </ModalBody>

      <ModalFooter></ModalFooter>
    </ModalContent>
  )
}