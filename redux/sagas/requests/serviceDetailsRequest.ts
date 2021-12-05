import { AxiosResponse } from 'axios';
import { requestServiceDetails } from 'middleware/api/services';
import { ClinicServiceDetails } from 'types';

export async function requestFetchServiceDetails(
  serviceId: number,
): Promise<AxiosResponse<ClinicServiceDetails>> {
  return requestServiceDetails(serviceId);
}
