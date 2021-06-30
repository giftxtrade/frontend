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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import axios from 'axios';
import { IEvent } from '../types/Event';
import { api } from '../util/api';
import { IDraw } from '../types/Draw';
import { unstable_batchedUpdates } from 'react-dom';
import ParticipantUser from './ParticipantUser';
import { User } from '../store/jwt-payload';

export interface IDrawsProps {
  setShowDraw: Dispatch<SetStateAction<boolean>>
  onClose: () => void
  accessToken: string
  event: IEvent
  emailToImageMap: Map<string, User | null>
}

export default function Draws({ setShowDraw, onClose, accessToken, event, emailToImageMap }: IDrawsProps) {
  const [loading, setLoading] = useState(true)
  const [draws, setDraws] = useState(Array<IDraw>())

  useEffect(() => {
    axios.get(`${api.draws}/${event.id}`, { headers: { "Authorization": "Bearer " + accessToken } })
      .then(({ data }: { data: IDraw[] }) => {
        unstable_batchedUpdates(() => {
          setLoading(false)
          setDraws(data)
        })
      })
      .catch(err => console.log(err))
  }, [])

  const drawAgain = () => {
    setLoading(true)
    axios.post(
      `${api.draws}`,
      { eventId: event.id },
      { headers: { "Authorization": "Bearer " + accessToken } }
    )
      .then(({ data }: { data: IDraw[] }) => {
        unstable_batchedUpdates(() => {
          setLoading(false)
          setDraws(data)
        })
      })
      .catch(err => console.log(err))
  }

  return (
    <ModalContent>
      <ModalHeader>Draws</ModalHeader>
      <ModalCloseButton onClick={() => {
        setShowDraw(false)
        onClose()
      }} />

      <ModalBody>
        {loading ? (
          <Flex
            maxW='full'
            direction='column'
            alignItems='center'
            justifyContent='center'
            mt='5' mb='5'
            p='5'
          >
            <Spinner mb='5' />
          </Flex>
        ) : draws.length === 0 ? (
          <Text>
            Are you sure you want to draw?
            <Button
              size='sm'
              colorScheme='blue'
              ml='2'
              onClick={() => drawAgain()}
            >
              Yes
            </Button>
          </Text>
        ) : (
          <Box maxW='100%' overflowX='auto'>
            <Table size="sm" variant='simple'>
              <Thead>
                <Tr>
                  <Th>Participant</Th>
                  <Th>Draw</Th>
                </Tr>
              </Thead>
              <Tbody>
                    {draws.map(({ drawer, drawee }, i) => {
                      const drawerUser = emailToImageMap.get(drawer.email);
                      const draweeUser = emailToImageMap.get(drawee.email);
                      return (
                        (
                          <Tr>
                            <Td>
                              <ParticipantUser
                            user={drawerUser ? drawerUser : null}
                            name={drawer.name}
                            email={drawer.email}
                            participates={drawer.participates}
                            accepted={drawer.accepted}
                            organizer={drawer.organizer}
                            address={drawer.address}
                            id={drawer.id}
                          />
                        </Td>
                        <Td>
                          <ParticipantUser
                            user={draweeUser ? draweeUser : null}
                            name={drawee.name}
                            email={drawee.email}
                            participates={drawee.participates}
                            accepted={drawee.accepted}
                            organizer={drawee.organizer}
                            address={drawee.address}
                            id={drawee.id}
                          />
                        </Td>
                      </Tr>
                    )
                  )
                })}
              </Tbody>
            </Table>

            <Box mt='10'>
              Do you want to draw again?
              <Button
                colorScheme='blue'
                size='sm'
                ml='2'
                onClick={() => drawAgain()}
              >
                Yes
              </Button>
            </Box>
          </Box>
        )}
      </ModalBody>

      <ModalFooter></ModalFooter>
    </ModalContent >
  );
}