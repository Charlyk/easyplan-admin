import { PatientSource } from 'types';

export interface CreatePatientRequest {
  phoneNumber: string;
  countryCode: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  birthday?: string;
  gender?: string;
  source?: PatientSource;
  language?: string;
  photo?: File;
}
