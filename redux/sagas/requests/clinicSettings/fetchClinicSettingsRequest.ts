import { AxiosResponse } from 'axios';
import { fetchClinicSettings } from 'middleware/api/clinic';
import { ClinicSettings } from '../../../../types';

export async function requestFetchClinicSettings(): Promise<
  AxiosResponse<ClinicSettings>
> {
  return fetchClinicSettings();
}
