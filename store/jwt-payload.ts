import { User, Auth } from "@giftxtrade/api-types";

export interface AuthState extends Auth {
  loggedIn: boolean;
}
