import { AxiosResponse } from 'axios';
import { requestCreatePatient as createPatient } from 'middleware/api/patients';
import { Patient } from 'types';
import { CreatePatientRequest } from 'types/api';

export async function requestCreatePatient(
  requestBody: CreatePatientRequest,
): Promise<AxiosResponse<Patient>> {
  return createPatient(requestBody, requestBody.photo);
}
