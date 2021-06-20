import { ICreateParticipant, IParticipant } from './Participant';

export interface IEvent {
  id: number
  name: string
  description: string
  budget: number
  invitationMessage: string
  createdAt: string
  drawAt: string
  closeAt: string
  participants: IParticipant[]
}

export interface ICreateEvent {
  name: string
  description: string
  budget: number
  invitationMessage: string
  drawAt: Date
  closeAt: Date
  participants: ICreateParticipant[]
}