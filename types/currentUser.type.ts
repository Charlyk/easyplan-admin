import { UserClinic } from 'types';
import { UserCalendarOrder } from './userCalendarOrder.type';

export interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  phoneNumber?: string | null;
  language: string;
  userClinic: any;
  clinics: UserClinic[];
  calendarOrders: UserCalendarOrder[];
}
