export interface PatientDebt {
  id: number;
  patientId: number;
  paidAmount: number;
  totalAmount: number;
  discount: number;
  remainedAmount: number;
  services: string[];
  currency: string;
  created: string | number;
  clinicName: string;
}
