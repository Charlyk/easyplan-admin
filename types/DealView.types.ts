import { CrmDealListItemType, PatientTag, ScheduleStatus } from 'types';

export type GroupedDeals = {
  state: DealStateView;
  deals: {
    total: number;
    data: CrmDealListItemType[];
  };
};

export interface DealView {
  id: number;
  source: DealSource;
  sourceDescription?: string | null;
  created: string | number;
  lastUpdated: string | number;
  messageSnippet?: string | null;
  deleteReason?: string | null;
  service?: DealServiceView;
  contact?: DealContactView;
  patient?: DealPatientView;
  schedule?: DealScheduleView;
  state: DealStateView;
  assignedTo?: DealAssignee;
  movedToClinic?: ClinicShortView;
}

export interface ClinicShortView {
  id: number;
  clinicName: string;
  logoUrl?: string | null;
  logoThumbnail?: string | null;
  timeZone: string;
}

export interface DealPatientView {
  id: number;
  photo?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneWithCode: string;
  phoneNumber: string;
  countryCode: string;
  tags: PatientTag[];
}

export interface DealServiceView {
  id: number;
  name: string;
  price: number;
  currency: string;
}

export interface DealScheduleView {
  id: number;
  created: string;
  dateAndTime: string;
  endTime?: string;
  doctor: DealAssignee;
  canceledReason?: string | null;
  status: ScheduleStatus;
}

export interface DealContactView {
  id: number;
  name: string;
  photoUrl?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
  identificator?: string | null;
}

export interface DealAssignee {
  id: number;
  firstName: string;
  lastName: string;
}

export enum DealSource {
  Facebook = 'Facebook',
  Viber = 'Viber',
  Whatsapp = 'Whatsapp',
  Instagram = 'Instagram',
  Telegram = 'Telegram',
  PhoneCall = 'PhoneCall',
  Unknown = 'Unknown',
  Manual = 'Manual',
}

export interface DealStateView {
  id: number;
  name: string;
  color: string;
  orderId: number;
  deleteable: boolean;
  type: DealStateType;
  visibleByDefault: boolean;
}

export enum DealStateType {
  Unsorted = 'Unsorted',
  FirstContact = 'FirstContact',
  Rescheduled = 'Rescheduled',
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Failed = 'Failed',
  Custom = 'Custom',
  ClosedNotRealized = 'ClosedNotRealized',
}
