import { ClinicServiceType } from 'types';

export interface ClinicService {
  id: number;
  name: string;
  color: string;
  description?: string;
  deleted: boolean;
  price: number;
  duration: number;
  categoryId: number;
  serviceType: ClinicServiceType;
  currency: string;
}

export interface ClinicServiceCategory {
  id: number;
  name: string;
}

export interface ClinicServiceDetails extends ClinicService {
  doctors: ServiceUser[];
  created: string;
}

export interface ServiceUser {
  id: number;
  fullName: string;
  price?: number | null;
  percentage?: number | null;
  selected: boolean;
}
