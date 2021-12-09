import { CurrentUser } from 'types';

export interface AuthenticationResponse {
  user: CurrentUser;
  token: string;
}
