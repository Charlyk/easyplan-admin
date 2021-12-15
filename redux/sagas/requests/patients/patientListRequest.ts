import { IncomingHttpHeaders } from 'http';
import { AxiosResponse } from 'axios';
import { getPatients } from 'middleware/api/patients';
import { Patient } from 'types';

export async function requestFetchPatientList(
  query: Record<string, string>,
  headers: IncomingHttpHeaders,
): Promise<AxiosResponse<{ data: Patient[]; total: number }>> {
  return getPatients(query, headers);
}
