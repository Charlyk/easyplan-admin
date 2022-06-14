export interface PatientPhoneRecordsRequest {
  patientId: number;
  page: number;
}

export interface UpdatePatientPhonePayload {
  id: number | string;
  comment: string;
}
