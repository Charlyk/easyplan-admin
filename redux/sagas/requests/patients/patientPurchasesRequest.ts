import { AxiosResponse } from 'axios';
import { requestFetchPatientPurchases as fetchPurchases } from 'middleware/api/patients';
import { PatientPurchase } from 'types';

export async function requestFetchPatientPurchases(
  patientId: number,
): Promise<AxiosResponse<PatientPurchase[]>> {
  return fetchPurchases(patientId);
}
