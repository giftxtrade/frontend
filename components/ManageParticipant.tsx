import React, { Dispatch, SetStateAction } from 'react';
import {
  Input,
  Stack,
  Checkbox,
  FormControl,
  Box,
  Text,
  Button,
  Flex,
  Icon
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons';
import { Participant } from "@giftxtrade/api-types"

export interface IManageParticipantProps {
  id: number
  p: Participant
  meParticipant: Participant
  removeParticipant: (i: number, p: Participant) => void
  updateOrganizerStatus: (
    i: number,
    participant: Participant,
    status: boolean,
  ) => void
}

export function ManageParticipant({ id, p, meParticipant, removeParticipant, updateOrganizerStatus }: IManageParticipantProps) {
  const idOffset = id - 1;
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <FormControl id={`nameForm${id}`}>
          <Input
            placeholder="Name"
            type='text'
            value={p.name}
            onChange={(e) => { }}
            variant='filled'
            name={`nameInput${id}`}
          />
        </FormControl>

        <FormControl id={`emailForm${id}`}>
          <Input
            placeholder="Email"
            type='email'
            value={p.email}
            onChange={(e) => { }}
            variant='filled'
            name={`emailInput${id}`}
          />
        </FormControl>
      </Stack>

      <Stack mt='3' spacing={6} direction="row" justifyContent='space-between'>
        <Stack spacing={6} direction="row">
          <Checkbox
            isDisabled={p.id === meParticipant.id}
            defaultIsChecked={p.organizer}
            onChange={(e) => updateOrganizerStatus(idOffset, p, e.target.checked)}
          >
            Organizer
          </Checkbox>

          <Checkbox
            isDisabled={true}
            defaultIsChecked={p.participates}
            onChange={(e) => { }}
          >
            Participant
          </Checkbox>
        </Stack>

        <Button
          variant='ghost'
          size='sm'
          colorScheme='red'
          onClick={() => removeParticipant(idOffset, p)}
          isDisabled={p.id === meParticipant.id}
        >
          <Icon as={DeleteIcon} />
        </Button>
      </Stack>
    </Box>
  )
}