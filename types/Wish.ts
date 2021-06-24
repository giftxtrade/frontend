import { IProduct } from './Product';

export interface ICreateWish {
  eventId: number
  productId: number
  participantId: number
}

export interface IWish {
  id: number
  createdAt: string
  product: IProduct
}