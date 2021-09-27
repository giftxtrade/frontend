export interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
}

export interface AuthState {
  accessToken: string;
  user: User;
  gToken: string;
  loggedIn: boolean;
}

export default interface JwtPayload {
  user: User;
  gToken: string;
  accessToken: string;
}