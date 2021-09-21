import { ILink } from './Link';
import { ICreateParticipant, IParticipant, IParticipantUser } from './Participant';

export interface IEventBase {
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

export interface IEventFull extends IEventUser {
  links: ILink[]
}

export interface IEventDetails {
  id: number
  name: string
  description: string
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