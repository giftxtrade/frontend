import { Dispatch, SetStateAction, useState } from 'react';
import {
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Button
} from '@chakra-ui/react'
import axios from "axios"
import { api } from '../util/api';
import { IDraw } from '../types/Draw';
import { IParticipant } from '../types/Participant';
import { useRouter } from 'next/router';
import { Event } from "@giftxtrade/api-types"

export interface ILeaveGroupProps {
  setLeaveGroupModal: Dispatch<SetStateAction<boolean>>
  onClose: () => void
  accessToken: string
  event: Event
  meParticipant: IParticipant
}

export default function LeaveGroup({ setLeaveGroupModal, onClose, accessToken, event, meParticipant }: ILeaveGroupProps) {
  const [loading, setLoading] = useState(false)
  const [draws, setDraws] = useState(Array<IDraw>())
  const router = useRouter()

  const leaveGroup = () => {
    setLoading(true)

    axios.delete(`${api.participants}/${meParticipant.id}`, {
      headers: { "Authorization": "Bearer " + accessToken }
    })
      .then(({ data }) => {
        setLoading(false);
        router.push('/home')
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
  }

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
        <Button
          colorScheme='blackAlpha'
          variant='ghost'
          mr={3}
          onClick={onClose}
          disabled={loading}
        >
          No
        </Button>

        <Button
          colorScheme="red"
          onClick={leaveGroup}
          isLoading={loading}
        >
          Yes
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}