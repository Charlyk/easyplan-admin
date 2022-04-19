import { AppLocale, AppRole } from 'types';

export type AppUserInfo = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string;
  phoneNumber: string | null;
  email: string;
  avatar: string | null;
  role: AppRole;
  blocked: boolean;
  language: AppLocale;
  canCreateAppointments: boolean;
  canManageOthersAppointments: boolean;
};
