import { DealStateType } from './DealView.types';
import { PatientTag } from './pubnubMessage.types';

export type CrmDealListItemType = {
  id: number;
  source: string;
  sourceDescription: string | null;
  created: string;
  updated: string;
  messageSnippet: string | null;
  contactName: string | null;
  contactPhone: string | null;
  patientId: number | null;
  patientName: string | null;
  patientPhone: string | null;
  serviceName: string | null;
  doctorId: number | null;
  doctorName: string | null;
  responsibleId: number | null;
  responsibleName: string | null;
  stateId: number;
  stateOrderId: number;
  stateType: DealStateType;
  scheduleId: number | null;
  appointmentDate: string | null;
  appointmentCanceledReason: string | null;
  patientTags: PatientTag;
  contactPhoto?: string | null;
};
