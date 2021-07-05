import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Flex,
  Stack,
  Spinner,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  InputGroup,
  InputLeftElement,
  FormHelperText,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
} from '@chakra-ui/react'
import axios from 'axios';
import { IEvent } from '../types/Event';
import { api } from '../util/api';
import { IDraw } from '../types/Draw';
import { unstable_batchedUpdates } from 'react-dom';
import ParticipantUser from './ParticipantUser';
import { User } from '../store/jwt-payload';
import { IParticipantUser, IParticipant } from '../types/Participant';

export interface ISettingsProps {
  setSettingsModal: Dispatch<SetStateAction<boolean>>
  onClose: () => void
  accessToken: string
  event: IEvent
  participants: IParticipantUser[]
  meParticipant: IParticipant
}

export default function Settings({ setSettingsModal, onClose, accessToken, event, participants, meParticipant }: ISettingsProps) {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState(event.name)
  const [description, setDescription] = useState(event.description)
  const [budget, setBudget] = useState(event.budget)
  const [drawDate, setDrawDate] = useState(new Date(event.drawAt).toISOString().substr(0, 10))

  return (
    <ModalContent>
      <ModalHeader>Settings</ModalHeader>
      <ModalCloseButton onClick={() => {
        setSettingsModal(false)
        onClose()
      }} />

      <ModalBody pl='0' pr='0'>
        <Tabs>
          <TabList>
            <Tab>Details</Tab>
            <Tab>Participants</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Stack spacing='5'>
                <FormControl id="name">
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    placeholder='Ex. Eid 2021 Gift Exchange'
                    type='text'
                    name='name'
                    autoFocus={true}
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                </FormControl>

                <FormControl id="description">
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Describe your event"
                    name='description'
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                  />
                </FormControl>

                <Stack direction="row" spacing={2}>
                  <FormControl id="budget">
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

                  <FormControl id="drawDate">
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

              <Box>
                <Flex mt='8' justifyContent='flex-end'>
                  <Button
                    type='submit'
                    colorScheme="blue"
                    onClick={(e: any) => {
                      e.preventDefault();
                    }}
                  >
                    Update Event
                  </Button>
                </Flex>
              </Box>

              <Divider mt='7' mb='10' />

              <Box>
                <Stack direction='row' justifyContent='space-between' spacing='2'>
                  <Box>
                    <Heading size='sm'>Delete this event</Heading>
                    <Text fontSize='.8em'>Once you delete an event, there is no going back. Please be certain. </Text>
                  </Box>

                  <Button colorScheme='red' size='sm' pl='5' pr='5'>Delete Event</Button>
                </Stack>
              </Box>
            </TabPanel>

            <TabPanel>
              {participants.filter(p => p.id !== meParticipant.id || (p.participates && !p.organizer)).map((p, i) => (
                <Stack direction='row' justifyContent='space-between' spacing='2' mb='7'>
                  <ParticipantUser
                    id={p.id}
                    name={p.name}
                    email={p.email}
                    address={p.address}
                    organizer={p.organizer}
                    participates={p.participates}
                    accepted={p.accepted}
                    user={p.user}
                    event={event}
                  />

                  <Box>
                    <Button colorScheme='red' size='xs'>
                      Remove
                    </Button>
                  </Box>
                </Stack>
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>

      <ModalFooter></ModalFooter>
    </ModalContent>
  );
}