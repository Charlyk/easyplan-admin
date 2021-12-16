import { AxiosResponse } from 'axios';
import { getPatients } from 'middleware/api/patients';
import { Patient } from 'types';

export async function requestFetchPatientList(
  query: Record<string, string>,
): Promise<AxiosResponse<{ data: Patient[]; total: number }>> {
  return getPatients(query);
}
