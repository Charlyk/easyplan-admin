import { ScheduleStatus } from '../../scheduleStatus.type';
import { PaginatedResponse } from './serverResponse.types';

export type ConsultationsResponse = PaginatedResponse<Consultation>;

export type Consultation = {
  id: number;
  date: string;
  comment: string | null;
  patient: { id: number; name: string; phone: string };
  doctor: { id: number; name: string };
  guide: { id: number; name: string };
  status: ScheduleStatus;
};
