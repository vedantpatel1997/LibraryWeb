import { User } from './User';

export interface APIToken {
  token: string;
  refreshToken: string;
  curUser: Number;
  curUserData: User;
}
