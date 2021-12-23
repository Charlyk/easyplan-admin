import { AxiosResponse } from 'axios';
import { getPatientPhoneRecords } from 'middleware/api/patients';
import { PatientCallRecord } from 'types';

export async function requestFetchPatientPhoneRecords(
  patientId: number,
  page: number,
): Promise<AxiosResponse<PatientCallRecord[]>> {
  return getPatientPhoneRecords(patientId, page);
}
