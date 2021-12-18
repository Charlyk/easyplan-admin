import { ClinicServiceType } from './clinicServiceType.type';

export interface UserService {
  id: number;
  serviceId: number;
  name: string;
  color: string;
  price?: number | null;
  percentage?: number | null;
  serviceType: ClinicServiceType;
  duration: number;
  selected: boolean;
}
