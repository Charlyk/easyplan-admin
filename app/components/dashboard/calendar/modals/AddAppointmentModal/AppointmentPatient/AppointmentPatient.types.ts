import { Patient } from 'types';

export interface CountryData {
  name: string;
  dialCode: string;
  countryCode: string;
  format: string;
}

export interface AppointmentNewPatient {
  patientFirstName: string;
  patientLastName: string;
  patientPhoneNumber: string;
  patientBirthday: string;
  patientLanguage: string;
  patientSource: string;
  patientEmail: string;
  patientCountryCode: string;
  isPhoneValid: boolean;
  phoneCountry: CountryData;
}

export interface AppointmentPatientState {
  patient?: Patient | null;
  newPatient?: AppointmentNewPatient | null;
  isPhoneValid: boolean;
  country: CountryData;
  showBirthdayPicker: boolean;
}

export interface AppointmentPatientProps {
  open: boolean;
  value?: string;
  onClose: () => void;
  onSaved?: (patient: Patient) => void;
}
