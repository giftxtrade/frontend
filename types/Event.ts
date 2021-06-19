import { ICreateParticipant } from './Participant';
export interface ICreateEvent {
  name: string;
  description: string;
  budget: number;
  invitationMessage: string;
  drawAt: Date;
  closeAt: Date;
  participants: ICreateParticipant[]
}