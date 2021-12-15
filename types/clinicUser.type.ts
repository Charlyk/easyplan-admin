import { Cabinet, UserRole, UserService } from 'types';

export interface ClinicUser {
  id: number;
  cabinets: Cabinet[];
  accessBlocked: boolean;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  email: string;
  avatar?: string;
  roleInClinic: UserRole;
  canRegisterPayments: boolean;
  created: string;
  services: UserService[];
  isInVacation: boolean;
  isHidden: boolean;
  showInCalendar: boolean;
}
