import { AxiosResponse } from 'axios';
import { getPatientVisits } from 'middleware/api/patients';
import { PatientVisit } from 'types';

export async function requestFetchPatientVisits(
  patientId: number,
): Promise<AxiosResponse<PatientVisit[]>> {
  return getPatientVisits(patientId);
}
