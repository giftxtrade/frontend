import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Flex,
  Spinner,
  Heading,
  Box,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react"
import axios from "axios"
import { api } from "../../util/api";
import { IDraw, IDrawParticipant } from "../../types/Draw";
import { unstable_batchedUpdates } from "react-dom";
import ParticipantUser from "./../ParticipantUser";
import { IParticipantUser } from "../../types/Participant"
import { Event } from "@giftxtrade/api-types"

export interface IDrawsProps {
  setShowDraw: Dispatch<SetStateAction<boolean>>
  setMyDraw: Dispatch<SetStateAction<IParticipantUser | undefined>>
  onClose: () => void
  accessToken: string
  event: Event
  meParticipant: IParticipantUser | undefined
}

export default function Draws({ setShowDraw, onClose, setMyDraw, accessToken, event, meParticipant }: IDrawsProps) {
  const [loading, setLoading] = useState(true)
  const [draws, setDraws] = useState(Array<IDrawParticipant>())
  const [confirmDisable, setConfirmDisable] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false)

  const toast = useToast()

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
      .then(({ data }: { data: IDrawParticipant[] }) => {
        unstable_batchedUpdates(() => {
          setLoading(false)
          setDraws(data.sort(sorter))
        })
      })
      .catch(_ => {
        toast({
          title: 'Something went wrong',
          variant: 'subtle',
          status: 'error'
        })
        setLoading(false)
      })
  }, [])

  const drawAgain = () => {
    setLoading(true)
    axios.post(
      `${api.draws}`,
      { eventId: event.id },
      { headers: { "Authorization": "Bearer " + accessToken } }
    )
      .then(({ data }: { data: IDrawParticipant[] }) => {
        unstable_batchedUpdates(() => {
          setLoading(false)
          setDraws(data.sort(sorter))
          const myDraw = data.find(({ drawer }) => drawer.email === meParticipant?.email)
          if (myDraw)
            setMyDraw(myDraw.drawee)
          setConfirmDisable(false);
        })
      })
      .catch(_ => {
        toast({
          title: 'Could not generate draws',
          variant: 'subtle',
          status: 'error'
        })
        setLoading(false)
      })
  }

  const notifyParticipants = () => {
    if (!confirmDisable) {
      axios.get(
        `${api.draw_confirm}/${event.id}`,
        { headers: { "Authorization": "Bearer " + accessToken } }
      )
        .then(({ data }: { data: IDraw[] }) => {
          setConfirmLoading(false)
          onClose()
          toast({
            title: 'Notifying participants...',
            variant: 'subtle',
            status: 'success'
          })
        })
        .catch(_ => {
          toast({
            title: 'Could not generate draws',
            variant: 'subtle',
            status: 'error'
          })
          unstable_batchedUpdates(() => {
            setConfirmLoading(false)
            setConfirmDisable(false)
          })
        })
    }
  }

  const drawUser = (p: IParticipantUser, key: string) => {
    return (
      <Box mb='3' height='50px' overflowY='hidden'>
        <ParticipantUser
          user={p.user}
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
        notifyParticipants()
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
            <>
              {drawAgain()}
            </>
        ) : (
          <Box maxW='100%' overflowX='auto'>
            <SimpleGrid columns={2}>
              <Box>
                <Heading size='sm' mb='3'>Participant</Heading>

                    {draws.map(({ drawer }, i) => drawUser(drawer, `drawer#${i}`))}
              </Box>

              <Box>
                <Heading size='sm' mb='3'>Draw</Heading>

                    {draws.map(({ drawee }, i) => drawUser(drawee, `drawee#${i}`))}
              </Box>
            </SimpleGrid>
          </Box>
        )}
      </ModalBody>

      <ModalFooter>
        <Button
          size='sm'
          ml='2'
          onClick={() => drawAgain()}
        >
          Draw Again
        </Button>

        <Button
          colorScheme='blue'
          size='sm'
          ml='2'
          onClick={() => {
            setConfirmLoading(true)
            notifyParticipants()
          }}
          disabled={confirmDisable}
          isLoading={confirmLoading}
        >
          Confirm
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}