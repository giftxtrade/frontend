export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
}

export default interface JwtPayload {
  user: User;
  gToken: string;
  accessToken: string;
}