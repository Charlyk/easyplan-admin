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
