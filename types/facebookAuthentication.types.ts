import { FacebookPageType } from './facebookPage.types';

export type FacebookAuthenticationType = {
  accessToken: string;
  pages: FacebookPageType[];
};
