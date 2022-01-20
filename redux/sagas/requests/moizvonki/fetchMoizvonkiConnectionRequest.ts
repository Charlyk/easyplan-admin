import { AxiosResponse } from 'axios';
import { fetchMoizvonkiConnection } from 'middleware/api/moizvonki';
import { MoizvonkiConnection } from 'types';

export async function requestFetchMoizvonkiConnection(): Promise<
  AxiosResponse<MoizvonkiConnection>
> {
  return fetchMoizvonkiConnection();
}
