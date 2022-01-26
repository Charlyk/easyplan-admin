export interface UpdateClinicRequest {
  id: number;
  clinicName: string;
  email: string;
  phoneNumber: string;
  telegramNumber: string;
  viberNumber: string;
  whatsappNumber: string;
  website: string;
  currency: string;
  country: string;
  description?: string | null;
  logo?: File | null;
  hasBrackets: boolean;
  workdays: ClinicWorkDay[];
  timeBeforeOnSite: number;
  timeZone: string;
}

interface ClinicWorkDay {
  id: number;
  day: number;
  startHour: string;
  endHour: string;
  isDayOff: boolean;
}
