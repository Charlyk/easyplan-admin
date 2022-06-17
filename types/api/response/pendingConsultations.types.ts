import { PaginatedResponse } from './serverResponse.types';

export type PendingConsultationsResponse =
  PaginatedResponse<PendingConsultation>;

export type PendingConsultation = {
  id: number;
  date: string;
  comment: string | null;
  patient: { id: number; name: string; phone: string };
  doctor: { id: number; name: string };
};
