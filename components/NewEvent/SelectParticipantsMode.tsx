import { AddIcon, LinkIcon } from '@chakra-ui/icons';
import {
  Text,
  Button,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex
} from '@chakra-ui/react';
import { IParticipantForm } from '../NewEvent';
import { Dispatch, SetStateAction } from 'react';
import { ParticipantForm } from '../ParticipantForm';
import { Event } from "@giftxtrade/api-types"

export interface ISelectParticipantsMode {
  setMain: Dispatch<SetStateAction<boolean>>
  name: string
  forms: IParticipantForm[]
  setForms: Dispatch<SetStateAction<Array<IParticipantForm>>>
  error: boolean
  loading: boolean

  handleCreateEvent: (redirect: boolean) => void
  handleGenerateLink: () => void

  redirectToEvent: (event: Event) => void
}

export default function SelectParticipantsMode({ name, forms, setForms, error, loading, setMain, handleGenerateLink, handleCreateEvent }: ISelectParticipantsMode) {
  return (
    <ModalContent>
      <ModalHeader>{name}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing='9' mb='10'>
          {
            forms.map((form, i) => (
              <ParticipantForm
                id={i + 1}
                form={form}
                forms={forms}
                setForms={setForms}
                key={`form${i}`}
              />
            ))
          }
        </Stack>

        <Flex direction='row' alignItems='center' justifyContent='start'>
          <Button
            leftIcon={<AddIcon />}
            variant="solid"
            size='sm'
            mr='3'
            onClick={() => {
              setForms([
                ...forms,
                {
                  name: '',
                  email: '',
                  creator: false,
                  organizer: false,
                  participates: true
                }
              ])
            }}
          >
            Add Participant
          </Button>

          <Text mr='3'>or</Text>

          <Button
            leftIcon={<LinkIcon />}
            variant="solid"
            size='sm'
            colorScheme='teal'
            onClick={handleGenerateLink}
          >
            Share Link
          </Button>
        </Flex>

        {error ? (
          <Alert status="error" mt='7' rounded='md'>
            <AlertIcon />
            <AlertTitle mr={2}>Error!</AlertTitle>
            <AlertDescription>Could not create your event</AlertDescription>
          </Alert>
        ) : <></>}
      </ModalBody>

      <ModalFooter mt='7'>
        <Button variant='ghost' mr={3} onClick={() => setMain(true)}>
          Back
        </Button>
        <Button
          colorScheme="blue"
          isDisabled={forms.find(f => f.name === '' || f.email === '') !== undefined}
          onClick={() => {
            handleCreateEvent(true)
          }}
          isLoading={loading}
        >
          Create Event
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}