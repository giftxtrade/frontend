import {
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { User } from '../store/jwt-payload';
import { api } from '../util/api';
import { unstable_batchedUpdates } from 'react-dom';
import { IEvent } from '../types/Event';
import MainMode from './NewEvent/MainMode';
import SelectParticipantsMode from './NewEvent/SelectParticipantsMode';
import GetLinkMode from './NewEvent/GetLinkMode';

export interface IParticipantForm {
  creator: boolean
  name: string
  email: string
  organizer: boolean
  participates: boolean
}

export interface INewEventProps {
  isOpen: boolean
  onClose: () => void
  accessToken: string
  user: User
  addEvent: (e: IEvent) => void
}

export function NewEvent({ isOpen, onClose, accessToken, user, addEvent }: INewEventProps) {
  const [main, setMain] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState(0.0)
  const [drawDate, setDrawDate] = useState("")
  const [forms, setForms] = useState(Array<IParticipantForm>())
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reset, setReset] = useState(false)
  const [getLink, setGetLink] = useState(false)
  const [linkLoading, setLinkLoading] = useState(false)
  const [link, setLink] = useState('')
  const [copy, setCopy] = useState(false)

  useEffect(() => {
    setForms([{
        name: user.name,
        email: user.email,
        creator: true,
        organizer: true,
        participates: true,
    }])
  }, [reset])

  const getData = () => {
    const participants: any[] = forms.map(f => {
      return {
        name: f.name,
        email: f.email,
        address: "",
        organizer: f.creator ? true : f.organizer,
        participates: f.participates,
        accepted: f.creator ? true : false
      }
    })

    const drawDateF = new Date(drawDate)
    const closeDateF = new Date(drawDate)
    closeDateF.setMonth(closeDateF.getMonth() + 2)

    return {
      name: name,
      description: description,
      budget: budget,
      invitationMessage: "",
      drawAt: drawDateF.toString(),
      closeAt: closeDateF.toString(),
      participants: participants
    }
  }

  const handleCreateEvent = () => {
    setLoading(true)
    setError(false)

    axios.post(api.events, getData(), {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    })
      .then(({ data }) => {
        unstable_batchedUpdates(() => {
          setMain(true)
          setName('')
          setDescription('')
          setBudget(0)
          setDrawDate('')
          setReset(true)
          setLoading(false)
          addEvent(data)
          onClose()
        })
      })
      .catch(err => {
        unstable_batchedUpdates(() => {
          setError(true)
          setLoading(false)
        })
      })
  }

  const handleGenerateLink = () => {
    setGetLink(true)
    setLinkLoading(true)

    axios.post(api.events, getData(), {
      headers: {
        "Authorization": "Bearer " + accessToken
      }
    })
      .then(({ data }) => {
        addEvent(data)

        axios.post(
          `${api.get_link}/${data.id}`,
          {
            expirationDate: new Date(drawDate).toString()
          },
          {
            headers: { "Authorization": "Bearer " + accessToken }
          })
          .then(({ data }) => {
            unstable_batchedUpdates(() => {
              setError(false)
              setLinkLoading(false)
              setLink(data.code)
            })
          })
          .catch(err => {
            unstable_batchedUpdates(() => {
              setLinkLoading(false)
              setError(true)
            })
          })
      })
      .catch(err => {
        unstable_batchedUpdates(() => {
          setError(true)
          setLoading(false)
        })
      })
  }

  return (
    <Modal size='xl' isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      {
        main ? (
          <MainMode
            name={name}
            description={description}
            budget={budget}
            drawDate={drawDate}
            setName={setName}
            setDescription={setDescription}
            setBudget={setBudget}
            setDrawDate={setDrawDate}
            onClose={onClose}
            setMain={setMain}
          />
        ) : (
            !getLink ? (
              <SelectParticipantsMode
                name={name}
                forms={forms}
                setForms={setForms}
                error={error}
                loading={loading}
                setMain={setMain}
                handleGenerateLink={handleGenerateLink}
                handleCreateEvent={handleCreateEvent}
              />
            ) : (
                <GetLinkMode
                  linkLoading={linkLoading}
                  error={error}
                  link={link}
                  copy={copy}
                  drawDate={drawDate}
                  setCopy={setCopy}
                  setMain={setMain}
                  setGetLink={setGetLink}
                  setBudget={setBudget}
                  setName={setName}
                  setDrawDate={setDrawDate}
                  setDescription={setDescription}
                  setReset={setReset}
                  onClose={onClose}
                />
            )
          )
      }
    </Modal>
  )
}