import { UserRole, UserService } from 'types';

export interface UserClinic {
  id: number;
  clinicId: number;
  clinicName: string;
  roleInClinic: UserRole;
  clinicLogo?: string | null;
  canRegisterPayments: boolean;
  canManageOthersAppointments: boolean;
  canCreateSchedules: boolean;
  clinicDomain: string;
  accessBlocked: boolean;
  services: UserService;
  appointmentsColor?: string | null;
}
