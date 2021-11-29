import Cabinet from './cabinet';

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
  roleInClinic: 'ADMIN' | 'MANAGER' | 'DOCTOR' | 'RECEPTION' | 'NONE';
  canRegisterPayments: boolean;
  created: string;
  services: UserService[];
  isInVacation: boolean;
  isHidden: boolean;
  showInCalendar: boolean;
}
