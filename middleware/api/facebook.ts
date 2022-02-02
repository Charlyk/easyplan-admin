import { AxiosResponse } from 'axios';
import { FacebookAuthenticationType } from 'types';
import { post } from './request';

export async function generateFacebookAccessToken(
  code: string,
  token: string,
  redirectUrl: string,
  headers: any = null,
): Promise<AxiosResponse<FacebookAuthenticationType>> {
  return post('/api/facebook', headers, {
    code,
    token,
    redirectUrl,
  });
}
