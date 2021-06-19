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
import { IParticipantForm } from './NewEvent';
import { DeleteIcon } from '@chakra-ui/icons';

export interface IParticipantFormProps {
  id: number
  form: IParticipantForm
  forms: IParticipantForm[]
  setForms: Dispatch<SetStateAction<IParticipantForm[]>>
}

export function ParticipantForm({ id, form, forms, setForms }: IParticipantFormProps) {
  const idOffset = id - 1;
  return (
    <Box>
      <Text mb='2'>
        <Flex direction="row" justifyContent='space-between' alignItems='center'>
          <b>Participant #{id}</b>

          {!form.creator ? (
            <Button
              variant='ghost'
              size='sm'
              colorScheme='red'
              onClick={() => setForms(forms.filter((f, i) => {
                return i !== idOffset
              }))}
            >
              <Icon as={DeleteIcon} />
            </Button>
          ) : <></>}
        </Flex>
      </Text>
      <Stack direction="row" spacing={2}>
        <FormControl id={`nameForm${id}`} isDisabled={form.creator}>
          <Input
            placeholder="Name"
            type='text'
            value={form.name}
            onChange={(e) => {
              const input = e.target.value;
              setForms(forms.map((f, i) => {
                if (i === idOffset)
                  f.name = input
                return f
              }))
            }}
            variant={form.creator ? 'filled' : 'outline'}
            name={`nameInput${id}`}
          />
        </FormControl>

        <FormControl id={`emailForm${id}`} isDisabled={form.creator}>
          <Input
            placeholder="Email"
            type='email'
            value={form.email}
            onChange={(e) => {
              const input = e.target.value;
              setForms(forms.map((f, i) => {
                if (i === idOffset)
                  f.email = input
                return f
              }))
            }}
            variant={form.creator ? 'filled' : 'outline'}
            name={`emailInput${id}`}
          />
        </FormControl>
      </Stack>

      <Stack mt='3' spacing={6} direction="row">
        <Checkbox
          isDisabled={form.creator}
          defaultIsChecked={form.organizer}
          onChange={(e) => {
            setForms(forms.map((f, i) => {
              if (i === idOffset)
                f.organizer = e.target.checked
              return f
            }))
          }}
        >
          Organizer
        </Checkbox>
        <Checkbox
          defaultIsChecked={form.participates}
          onChange={(e) => {
            setForms(forms.map((f, i) => {
              if (i === idOffset)
                f.participates = e.target.checked
              return f
            }))
          }}
        >
          Participant
        </Checkbox>
      </Stack>
    </Box>
  )
}