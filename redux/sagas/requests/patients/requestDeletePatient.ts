import { AxiosResponse } from 'axios';
import { deletePatient } from 'middleware/api/patients';
import { Patient } from 'types';

export async function requestDeletePatient(
  id: number,
): Promise<AxiosResponse<Patient>> {
  return deletePatient(id);
}
