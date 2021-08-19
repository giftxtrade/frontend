import {
  Text,
  Button,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Stack,
  Textarea,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

export interface IMainModeProps {
  setMain: Dispatch<SetStateAction<boolean>>

  name: string
  setName: Dispatch<SetStateAction<string>>

  description: string
  setDescription: Dispatch<SetStateAction<string>>

  budget: number
  setBudget: Dispatch<SetStateAction<number>>

  drawDate: string
  setDrawDate: Dispatch<SetStateAction<string>>

  onClose: () => void
}

export default function MainMode({ name, setName, description, setDescription, budget, setBudget, drawDate, setDrawDate, setMain, onClose }: IMainModeProps) {
  return (
    <ModalContent>
      <form method='POST'>
        <ModalHeader>Create New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing='7'>
            <FormControl id="name" isRequired>
              <FormLabel>Event Name</FormLabel>
              <Input
                placeholder='Ex. Eid 2021 Gift Exchange'
                type='text'
                name='name'
                autoFocus={true}
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
              <FormHelperText>This will help you and the participants to identify an event</FormHelperText>
            </FormControl>

            <FormControl id="description">
              <FormLabel>Description <Text ml='1' color='gray.400' fontSize='sm' display='inline-block'>(Optional)</Text></FormLabel>
              <Textarea
                placeholder="Describe your event"
                name='description'
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
              />
            </FormControl>

            <Stack direction="row" spacing={2}>
              <FormControl id="budget" isRequired>
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

              <FormControl id="drawDate" isRequired>
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
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" variant='ghost' mr={3} onClick={onClose}>
            Discard
          </Button>
          <Button
            type='submit'
            colorScheme="blue"
            onClick={(e: any) => {
              setMain(false)
              e.preventDefault();
            }}
            isDisabled={!name || !budget || budget === 0 || !drawDate || new Date(drawDate) <= new Date(Date.now())}
          >
            Next: Invitations
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  )
}