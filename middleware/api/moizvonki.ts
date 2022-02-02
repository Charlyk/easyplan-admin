import { AxiosResponse } from 'axios';
import { MoizvonkiConnection } from 'types';
import { ConnectMoizvonkiRequest } from 'types/api';
import { del, get, post } from './request';

export async function fetchMoizvonkiConnection(
  headers: Record<string, string> = null,
): Promise<AxiosResponse<MoizvonkiConnection>> {
  return get('/api/clinic/integrations/moizvonki', headers);
}

export async function connectMoizvonkiService(
  data: ConnectMoizvonkiRequest,
  headers: Record<string, string> = null,
): Promise<AxiosResponse<MoizvonkiConnection>> {
  return post('/api/clinic/integrations/moizvonki', headers, data);
}

export async function disconnectMoizvonkiService(
  headers: Record<string, string> = null,
): Promise<AxiosResponse<string>> {
  return del('/api/clinic/integrations/moizvonki', headers);
}
