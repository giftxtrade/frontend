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
  const [draws, setDraws] = useState(Array<IDraw>())

  return (
    <ModalContent>
      <ModalHeader>Settings</ModalHeader>
      <ModalCloseButton onClick={() => {
        setSettingsModal(false)
        onClose()
      }} />

      <ModalBody>

      </ModalBody>

      <ModalFooter>
        <Button colorScheme="red" variant='ghost' mr={3} onClick={onClose}>
          Cancel
        </Button>

        <Button
          type='submit'
          colorScheme="blue"
          onClick={(e: any) => {
            e.preventDefault();
          }}
        >
          Save
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}