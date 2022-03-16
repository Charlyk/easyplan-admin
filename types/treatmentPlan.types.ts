import { Doctor } from './doctor.type';
import { ServiceShortView } from './serviceShortView.types';

export type TreatmentPlan = {
  id: number;
  created: string;
  lastUpdated: string;
  patient: TreatmentPatient;
  services: TreatmentService[];
};

export type TreatmentPatient = {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber: string;
  countryCode: string;
};

export type TreatmentService = {
  id: string;
  completed: boolean;
  quantity: number;
  teeth: string[];
  price: number;
  currency: string;
  created: string;
  lastUpdated: string;
  completedAt: string | null;
  exchangeValue: number;
  childServices: TreatmentChildService[];
  service: ServiceShortView;
  addedBy: Doctor;
  completedBy?: Doctor;
  clinicCurrency: string;
  group: ServiceGroup;
  selected?: boolean;
  schedule: ScheduleShortView | null;
};

export type TreatmentChildService = {
  id: string;
  name: string;
  completed: boolean;
  quantity: number;
  price: number;
  currency: string;
  created: string;
  lastUpdated: string;
  completedAt: string;
  exchangeValue: number;
  addedBy: Doctor;
  completedBy?: Doctor;
  clinicCurrency: string;
  selected?: boolean;
};

export type ScheduleShortView = {
  id: number | string;
  status: string;
};

export enum ServiceGroup {
  Treatment = 'Treatment',
  Surgery = 'Surgery',
  Prosthetics = 'Prosthetics',
}
