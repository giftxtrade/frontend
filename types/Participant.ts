import { User } from "../store/jwt-payload";

export interface IParticipant {
  id: number
  name: string
  email: string
  address: string
  organizer: boolean
  participates: boolean
  accepted: boolean
}

export interface IParticipantUser {
  id: number
  name: string
  email: string
  address: string
  organizer: boolean
  participates: boolean
  accepted: boolean
  user: User | null
}

export interface ICreateParticipant {
  name: string
  email: string
  address: string
  organizer: boolean
  participates: boolean
  accepted: boolean
}