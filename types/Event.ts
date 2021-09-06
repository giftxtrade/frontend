import { ICreateParticipant, IParticipant, IParticipantUser } from './Participant';

interface IEventBase {
  id: number
  name: string
  description: string
  budget: number
  invitationMessage: string
  createdAt: string
  drawAt: string
  closeAt: string
}

export interface IEvent extends IEventBase {
  participants: IParticipant[]
}

export interface IEventUser extends IEventBase {
  participants: IParticipantUser[]
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