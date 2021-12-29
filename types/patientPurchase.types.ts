export interface PatientPurchase {
  amount: number;
  clinicName: string;
  comment?: string;
  currency: string;
  id: number;
  invoiceId: number;
  scheduleId?: number | null;
  userComment?: number | null;
  userId: number;
  userName: string;
}
