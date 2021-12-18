export interface ShortInvoice {
  id: number;
  doctorFullName: string;
  patientFullName: string;
  scheduleDate: string | number;
  scheduleId?: number | null;
  paidAmount: number;
  status: InvoiceStatus;
  discount: number;
  totalAmount: number;
}

export enum InvoiceStatus {
  PendingPayment = 'PendingPayment',
  Paid = 'Paid',
  PartialPaid = 'PartialPaid',
}
