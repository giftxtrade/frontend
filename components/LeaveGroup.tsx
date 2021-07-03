import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button
} from '@chakra-ui/react'
import axios from 'axios';
import { IEvent } from '../types/Event';
import { api } from '../util/api';
import { IDraw } from '../types/Draw';
import { unstable_batchedUpdates } from 'react-dom';
import ParticipantUser from './ParticipantUser';
import { User } from '../store/jwt-payload';
import { IParticipantUser, IParticipant } from '../types/Participant';

export interface ILeaveGroupProps {
  setLeaveGroupModal: Dispatch<SetStateAction<boolean>>
  onClose: () => void
  accessToken: string
  event: IEvent
  meParticipant: IParticipant
}

export default function LeaveGroup({ setLeaveGroupModal, onClose, accessToken, event, meParticipant }: ILeaveGroupProps) {
  const [loading, setLoading] = useState(true)
  const [draws, setDraws] = useState(Array<IDraw>())

  return (
    <ModalContent>
      <ModalHeader>Leave Group</ModalHeader>
      <ModalCloseButton onClick={() => {
        setLeaveGroupModal(false)
        onClose()
      }} />

      <ModalBody>
        <Text>Are you sure you want to leave this group?</Text>
        <Text mt='2' color='gray.500' fontSize='sm'>Pressing <i>"yes"</i> will permanently remove you from this group. This action cannot be undone.</Text>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blackAlpha' variant='ghost' mr={3} onClick={onClose}>
          No
        </Button>

        <Button
          type='submit'
          colorScheme="red"
          onClick={(e: any) => {
            e.preventDefault();
          }}
        >
          Yes
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}