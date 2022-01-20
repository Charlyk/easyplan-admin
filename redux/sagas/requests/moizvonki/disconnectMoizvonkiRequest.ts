import { AxiosResponse } from 'axios';
import { disconnectMoizvonkiService } from 'middleware/api/moizvonki';

export async function requestDisconnectMoizvonki(): Promise<
  AxiosResponse<string>
> {
  return disconnectMoizvonkiService();
}
