import axios, { AxiosResponse } from 'axios';
import { Patient } from 'types';
import { PaginatedResponse } from 'types/api';

export async function requestFilteredPatients(
  query: string,
): Promise<AxiosResponse<PaginatedResponse<Patient>>> {
  const queryString = new URLSearchParams({
    page: '0',
    rowsPerPage: '10',
    query,
  }).toString();
  return axios.get(`/api/patients?${queryString}`);
}
