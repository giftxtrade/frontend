import { AddIcon } from '@chakra-ui/icons';
import {
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { User } from '../store/jwt-payload';
import { ParticipantForm } from './ParticipantForm';

export interface INewEventProps {
  isOpen: boolean
  onClose: () => void
  accessToken: string
  user: User
}

export interface IParticipantForm {
  creator: boolean
  name: string
  email: string
  organizer: boolean
  participates: boolean
}

export function NewEvent({ isOpen, onClose, accessToken, user }: INewEventProps) {
  const [main, setMain] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState(0.0)
  const [drawDate, setDrawDate] = useState("")
  const [forms, setForms] = useState(Array<IParticipantForm>())

  useEffect(() => {
    setForms([
      {
        name: user.name,
        email: user.email,
        creator: true,
        organizer: true,
        participates: true,
      },
      {
        name: '',
        email: '',
        creator: false,
        organizer: false,
        participates: true,
      },
      {
        name: '',
        email: '',
        creator: false,
        organizer: false,
        participates: true,
      },
    ])
  }, [])

  const handleCreateEvent = () => {
    const participants: any[] = forms.map(f => {
      return {
        name: f.name,
        email: f.email,
        address: "",
        organizer: f.creator ? true : f.organizer,
        participates: f.participates,
        accepted: f.creator ? true : false
      }
    })

    const data = {
      name: name,
      description: description,
      budget: budget,
      invitationMessage: "",
      drawAt: drawDate,
      closeAt: "",
      participants: participants
    }

    console.log(data);
  }

  return (
    <Modal size='xl' isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      {
        main ? (
          <ModalContent>
            <form method='POST'>
              <ModalHeader>Create New Event</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing='7'>
                  <FormControl id="name" isRequired>
                    <FormLabel>Event Name</FormLabel>
                    <Input
                      placeholder='Ex. Eid 2021 Gift Exchange'
                      type='text'
                      name='name'
                      autoFocus={true}
                      value={name}
                      onChange={(e: any) => setName(e.target.value)}
                    />
                    <FormHelperText>This will help you and the participants to identify an event</FormHelperText>
                  </FormControl>

                  <FormControl id="description">
                    <FormLabel>Description <Text ml='1' color='gray.400' fontSize='sm' display='inline-block'>(Optional)</Text></FormLabel>
                    <Textarea
                      placeholder="Describe your event"
                      name='description'
                      value={description}
                      onChange={(e: any) => setDescription(e.target.value)}
                    />
                  </FormControl>

                  <Stack direction="row" spacing={2}>
                    <FormControl id="budget" isRequired>
                      <FormLabel>Budget</FormLabel>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          color="gray.300"
                          fontSize="1.2em"
                          children="$"
                        />
                        <Input
                          placeholder="Enter amount"
                          type='number'
                          value={budget}
                          name='budget'
                          onChange={(e: any) => setBudget(parseFloat(e.target.value))}
                        />
                      </InputGroup>
                    </FormControl>

                    <FormControl id="budget" isRequired>
                      <FormLabel>Draw Date</FormLabel>
                      <Input
                        placeholder="Date"
                        type='date'
                        value={drawDate}
                        name='drawDate'
                        onChange={(e: any) => setDrawDate(e.target.value)}
                      />
                    </FormControl>
                  </Stack>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="red" variant='ghost' mr={3} onClick={onClose}>
                  Discard
                </Button>
                <Button
                  type='submit'
                  colorScheme="blue"
                  onClick={(e: any) => {
                    setMain(false)
                    e.preventDefault();
                  }}
                  isDisabled={!name || !budget || budget === 0 || !drawDate}
                >
                  Next: Invitations
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        ) : (
          <ModalContent>
            <form method='POST'>
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

                  <Button
                    leftIcon={<AddIcon />}
                    variant="solid"
                    size='sm'
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
              </ModalBody>

              <ModalFooter>
                <Button variant='ghost' mr={3} onClick={() => setMain(true)}>
                  Back
                </Button>
                  <Button
                    colorScheme="blue"
                    isDisabled={forms.length < 3 || forms.find(f => f.name === '' || f.email === '') !== undefined}
                    onClick={handleCreateEvent}
                  >
                    Create Event
                  </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        )
      }
    </Modal>
  )
}