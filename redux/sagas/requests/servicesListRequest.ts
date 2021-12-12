import { AxiosResponse } from 'axios';
import { fetchAllServices } from 'middleware/api/services';
import { ClinicService } from 'types';

export async function requestFetchServicesList(): Promise<
  AxiosResponse<{ services: ClinicService[]; categories: any[] }>
> {
  return fetchAllServices();
}
