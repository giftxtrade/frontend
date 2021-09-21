import { IParticipant, IParticipantUser } from './Participant';

export interface IDraw {
  id: number
  createdAt: string
  drawer: IParticipant
  drawee: IParticipant
}

export interface IDrawParticipant {
  id: number
  createdAt: string
  drawer: IParticipantUser
  drawee: IParticipantUser
}