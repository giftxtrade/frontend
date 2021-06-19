import { AddIcon } from '@chakra-ui/icons';
import {
  Flex,
  Spinner,
  Image,
  Heading,
  Text,
  Button,
  Link,
  Box,
  Container,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  InputGroup,
  InputLeftElement,
  Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';
import { User } from '../store/jwt-payload';
import { ParticipantForm } from './ParticipantForm';

interface INewEventProps {
  isOpen: boolean
  onClose: () => void
  accessToken: string
  user: User
}

export function NewEvent({ isOpen, onClose, accessToken, user }: INewEventProps) {
  const [main, setMain] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState(0.0)
  const [drawDate, setDrawDate] = useState("")

  return (
    <Modal size='lg' isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
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
                <Stack spacing='7' mb='7'>
                  <ParticipantForm
                    id={1}
                    name={user.name}
                    email={user.email}
                    disabled={true}
                  />

                  <ParticipantForm
                    id={2}
                    name=''
                    email=''
                    disabled={false}
                  />
                </Stack>

                <Button leftIcon={<AddIcon />} variant="solid" size='sm'>
                  Add Participant
                </Button>
              </ModalBody>

              <ModalFooter>
                <Button variant='ghost' mr={3} onClick={() => setMain(true)}>
                  Back
                </Button>
                <Button colorScheme="blue">Create Event</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        )
      }
    </Modal>
  )
}