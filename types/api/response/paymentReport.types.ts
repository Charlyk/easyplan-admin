import { PaginatedResponse } from './serverResponse.types';

export type PaymentReportResponse = PaginatedResponse<PaymentReport>;

export type PaymentReport = {
  id: number;
  amount: number;
  currency: string;
  paymentMethod: string;
  comment: string;
  userComment: string;
  created: string;
  user: { id: number; firstName: string; lastName: string };
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    phoneWithCode: string;
  };
};
