import { IParticipant } from './Participant';

export interface IDraw {
  id: number
  createdAt: string
  drawer: IParticipant
  drawee: IParticipant
}