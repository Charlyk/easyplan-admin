import { AxiosResponse } from 'axios';
import { getClinicDetails } from 'middleware/api/clinic';
import { CurrentClinic } from 'types';

export async function requestFetchClinic(
  date: string,
): Promise<AxiosResponse<CurrentClinic>> {
  return getClinicDetails(date);
}
