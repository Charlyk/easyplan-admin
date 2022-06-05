import axios, { AxiosResponse } from 'axios';
import { getPatientPhoneRecords } from 'middleware/api/patients';
import { PatientCallRecord } from 'types';
import { UpdatePatientPhonePayload } from '../../../../types/api';

export async function requestFetchPatientPhoneRecords(
  patientId: number,
  page: number,
): Promise<AxiosResponse<PatientCallRecord[]>> {
  return getPatientPhoneRecords(patientId, page);
}

export async function requestUpdatePatientPhoneRecords(
  data: UpdatePatientPhonePayload,
): Promise<AxiosResponse<PatientCallRecord>> {
  const { id, ...body } = data;
  return axios.put(`/api/patients/phone-records?id=${id}`, body);
}
