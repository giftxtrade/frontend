import {
  Input,
  Stack,
  Textarea,
  InputGroup,
  InputLeftElement,
  Checkbox,
  FormControl,
  Box,
  Text,
} from '@chakra-ui/react'

interface IParticipantFormProps {
  id: number
  disabled: boolean
  name: string
  email: string
}

export function ParticipantForm({ id, disabled, name, email }: IParticipantFormProps) {
  return (
    <Box>
      <Text mb='2'>
        Participant #{id}
      </Text>
      <Stack direction="row" spacing={2}>
        <FormControl id="budget" isDisabled={disabled}>
          <Input
            placeholder="Name"
            type='text'
            name='name'
            value={name}
          />
        </FormControl>

        <FormControl id="budget" isDisabled={disabled}>
          <Input
            placeholder="Email"
            type='email'
            name='email'
            value={email}
          />
        </FormControl>
      </Stack>

      <Stack mt='3' spacing={6} direction="row">
        <Checkbox isDisabled={disabled} defaultIsChecked={disabled}>Organizer</Checkbox>
        <Checkbox defaultIsChecked>
          Participant
        </Checkbox>
      </Stack>
    </Box>
  )
}