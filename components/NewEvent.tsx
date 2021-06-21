import { AddIcon, LinkIcon, InfoIcon, CopyIcon } from '@chakra-ui/icons';
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  CloseButton,
  Flex
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { User } from '../store/jwt-payload';
import { ParticipantForm } from './ParticipantForm';
import { api } from '../util/api';
import { unstable_batchedUpdates } from 'react-dom';
import { IEvent } from '../types/Event';
import { base } from '../util/site';

export interface IParticipantForm {
  creator: boolean
  name: string
  email: string
  organizer: boolean
  participates: boolean
}

export interface INewEventProps {
  isOpen: boolean
  onClose: () => void
  accessToken: string
  user: User
  addEvent: (e: IEvent) => void
}

export function NewEvent({ isOpen, onClose, accessToken, user, addEvent }: INewEventProps) {
  const [main, setMain] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState(0.0)
  const [drawDate, setDrawDate] = useState("")
  const [forms, setForms] = useState(Array<IParticipantForm>())
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [reset, setReset] = useState(false)
  const [getLink, setGetLink] = useState(false)
  const [linkLoading, setLinkLoading] = useState(false)
  const [link, setLink] = useState('')
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    setForms([{
        name: user.name,
        email: user.email,
        creator: true,
        organizer: true,
        participates: true,
    }])
  }, [reset])

  const getData = () => {
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

    const drawDateF = new Date(drawDate)
    const closeDateF = new Date(drawDate)
    closeDateF.setMonth(closeDateF.getMonth() + 2)

    return {
      name: name,
      description: description,
      budget: budget,
      invitationMessage: "",
      drawAt: drawDateF.toString(),
      closeAt: closeDateF.toString(),
      participants: participants
    }
  }

  const handleCreateEvent = () => {
    setLoading(true)
    setError(false)

    axios.post(api.events, getData(), {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    })
      .then(({ data }) => {
        unstable_batchedUpdates(() => {
          setMain(true)
          setName('')
          setDescription('')
          setBudget(0)
          setDrawDate('')
          setReset(true)
          setLoading(false)
          addEvent(data)
          onClose()
        })
      })
      .catch(err => {
        unstable_batchedUpdates(() => {
          setError(true)
          setErrorMessage(err)
          setLoading(false)
        })
      })
  }

  const handleGenerateLink = () => {
    setGetLink(true)
    setLinkLoading(true)

    axios.post(api.events, getData(), {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    })
      .then(({ data }) => {
        addEvent(data)

        axios.post(
          `${api.get_link}/${data.id}`,
          {
            expirationDate: new Date(drawDate).toString()
          },
          {
            headers: { "Authorization": "Bearer " + accessToken }
          })
          .then(({ data }) => {
            unstable_batchedUpdates(() => {
              setError(false)
              setLinkLoading(false)
              setLink(data.code)
            })
          })
          .catch(err => {
            unstable_batchedUpdates(() => {
              setLinkLoading(false)
              setError(true)
            })
          })
      })
      .catch(err => {
        unstable_batchedUpdates(() => {
          setError(true)
          setErrorMessage(err)
          setLoading(false)
        })
      })
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
            !getLink ? (
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
                    onClick={handleCreateEvent}
                    isLoading={loading}
                  >
                    Create Event
                  </Button>
                </ModalFooter>
              </ModalContent>
            ) : (
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
                                  {copy ? 'Copied!' : 'Copy'}
                                </Button>
                              </Flex>

                              <Text mt='5' fontSize='sm' color='gray.600'>
                                <InfoIcon mr='2' />
                                You can use the generated link to share with anyone that you want to have in your event. This link is set to deactivate on <i>{new Date(drawDate).toDateString()}</i>.
                              </Text>
                            </>
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
                            setCopy(false)
                            onClose()
                          }}>
                            Done
                          </Button>
                        </ModalFooter>
                    </>
                  )}

              </ModalContent>
            )
          )
      }
    </Modal>
  )
}