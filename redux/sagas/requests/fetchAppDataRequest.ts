import { AxiosResponse } from 'axios';
import { fetchAppData } from 'middleware/api/initialization';
import { AppDataRequest, AppDataResponse } from 'types/api';

export async function requestFetchAppData(
  request: AppDataRequest,
): Promise<AxiosResponse<AppDataResponse>> {
  return fetchAppData(request.headers, request.date);
}
