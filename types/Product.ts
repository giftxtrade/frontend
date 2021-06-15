export interface IProduct {
  id: number;
  title: string;
  description: string;
  productKey: string;
  imageUrl: string;
  rating: number;
  price: number;
  currency: string;
  modified: string;
  category: string;
  website: string;
}

export default class Product implements IProduct {
  id: number = 0;
  title: string = '';
  description: string = '';
  productKey: string = '';
  imageUrl: string = '';
  rating: number = 0;
  price: number = 0;
  currency: string = '';
  modified: string = '';
  category: string = '';
  website: string = '';
}
