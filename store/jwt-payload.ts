export interface User {
  id: number;
  name: string;
  phone?: string;
  email: string;
  imageUrl: string;
  active: boolean;
  admin?: boolean;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface AuthState {
  accessToken: string;
  user: User;
  loggedIn: boolean;
}

export default interface JwtPayload {
  user: User;
  accessToken: string;
}

export interface JwtAuthReturn {
  loggedIn: boolean;
  user: User;
  accessToken: string;
}