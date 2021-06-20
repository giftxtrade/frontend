export interface IParticipant {
  id: number
  name: string
  email: string
  address: string
  organizer: boolean
  participates: boolean
  accepted: boolean
}

export interface ICreateParticipant {
  name: string
  email: string
  address: string
  organizer: boolean
  participates: boolean
  accepted: boolean
}