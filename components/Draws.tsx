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
  SimpleGrid
} from '@chakra-ui/react'
import axios from 'axios';
import { IEvent } from '../types/Event';
import { api } from '../util/api';
import { IDraw } from '../types/Draw';
import { unstable_batchedUpdates } from 'react-dom';
import ParticipantUser from './ParticipantUser';
import { User } from '../store/jwt-payload';
import { IParticipant } from '../types/Participant';

export interface IDrawsProps {
  setShowDraw: Dispatch<SetStateAction<boolean>>
  setMyDraw: Dispatch<SetStateAction<IParticipant | null>>
  onClose: () => void
  accessToken: string
  event: IEvent
  emailToImageMap: Map<string, User | null>
  meParticipant: IParticipant
}

export default function Draws({ setShowDraw, onClose, setMyDraw, accessToken, event, emailToImageMap, meParticipant }: IDrawsProps) {
  const [loading, setLoading] = useState(true)
  const [draws, setDraws] = useState(Array<IDraw>())

  const sorter = (a: IDraw, b: IDraw) => {
    if (a.drawer.email < b.drawer.email) {
      return -1;
    } else if (a.drawer.email > b.drawer.email) {
      return 1;
    }
    return 0;
  }

  useEffect(() => {
    axios.get(`${api.draws}/${event.id}`, { headers: { "Authorization": "Bearer " + accessToken } })
      .then(({ data }: { data: IDraw[] }) => {
        unstable_batchedUpdates(() => {
          setLoading(false)
          setDraws(data.sort(sorter))
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
          setDraws(data.sort(sorter))
          const myDraw = data.find(({ drawer }) => drawer.email === meParticipant.email)
          if (myDraw)
            setMyDraw(myDraw.drawee)
        })
      })
      .catch(err => console.log(err))
  }

  const drawUser = (user: User | null | undefined, p: IParticipant, key: string) => {
    return (
      <Box mb='3' height='50px' overflowY='hidden'>
        <ParticipantUser
          user={user ? user : null}
          name={p.name}
          email={p.email}
          participates={p.participates}
          accepted={p.accepted}
          organizer={p.organizer}
          address={p.address}
          id={p.id}
          event={event}
          key={key}
        />
      </Box>
    )
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
            <SimpleGrid columns={2}>
              <Box>
                <Heading size='sm' mb='3'>Participant</Heading>

                {draws.map(({ drawer }, i) => drawUser(emailToImageMap.get(drawer.email), drawer, `drawer#${i}`))}
              </Box>

              <Box>
                <Heading size='sm' mb='3'>Draw</Heading>

                {draws.map(({ drawee }, i) => drawUser(emailToImageMap.get(drawee.email), drawee, `drawee#${i}`))}
              </Box>
            </SimpleGrid>
          </Box>
        )}
      </ModalBody>

      <ModalFooter>
        <Button
          colorScheme='blue'
          size='sm'
          ml='2'
          onClick={() => drawAgain()}
        >
          Draw Again
        </Button>

        <Button
          colorScheme='green'
          size='sm'
          ml='2'
          onClick={() => onClose()}
        >
          Confirm
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}