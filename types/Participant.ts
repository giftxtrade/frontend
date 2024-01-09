import { User } from "@giftxtrade/api-types";
import { IWish } from "./Wish";

export interface IParticipant {
  id: number;
  name: string;
  email: string;
  address: string;
  organizer: boolean;
  participates: boolean;
  accepted: boolean;
}

export interface IParticipantUser extends IParticipant {
  user: User | null;
}

export interface IParticipantUserWishes extends IParticipantUser {
  wishes: Array<IWish>;
}

export interface ICreateParticipant {
  name: string
  email: string
  address: string
  organizer: boolean
  participates: boolean
  accepted: boolean
}