import { AxiosResponse } from 'axios';
import { connectMoizvonkiService } from 'middleware/api/moizvonki';
import { MoizvonkiConnection } from 'types';
import { ConnectMoizvonkiRequest } from 'types/api';

export async function requestUpdateMoizvonkiConnection(
  data: ConnectMoizvonkiRequest,
): Promise<AxiosResponse<MoizvonkiConnection>> {
  return connectMoizvonkiService(data);
}
