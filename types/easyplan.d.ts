declare namespace Easyplan {
  export interface CurrentClinic {
    id: number;
    clinicName: string;
    logoUrl?: string;
    logoThumbnail?: string;
    website?: string;
    email?: string;
    phoneNumber?: string;
    currency: string;
    description?: string;
    country: string;
    viberNumber?: string;
    telegramNumber?: string;
    whatsappNumber?: string;
    timeBeforeOnSite: number;
    isImporting: boolean;
    updateExchangeRates: boolean;
    smsAlias?: string;
    timeZone: string;
    domainName: string;
    owner: string;
    services: ClinicService[];
    workdays: ClinicWorkday[];
    braces: ClinicBraces[];
    availableCurrencies: ExchangeRate[];
    allCurrencies: Currency[];
    facebookPages: FacebookPage[];
    users: ClinicUser[];
  }

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

  export interface ClinicBraces {
    id: number;
    price: number;
    isEnabled: boolean;
    name: string;
    color: string;
    duration: number;
  }

  export interface ClinicWorkday {
    id: number;
    day: number;
    isDayOff: boolean;
    startHour?: string;
    endHour?: string;
  }

  export interface ExchangeRate {
    currency: string;
    currencyName: string;
    value: number;
    created: string;
  }

  export interface Currency {
    id: string;
    name: string;
  }

  export enum ClinicServiceType {
    All = 'All',
    Single = 'Single',
    Braces = 'Braces',
    System = 'System',
  }

  export interface FacebookPage {
    id: string;
    name: string;
    category: string;
  }

  export interface ClinicUser {
    id: number;
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

  export interface UserService {
    id: number;
    serviceId: number;
    name: string;
    color: string;
    price: number;
    percentage: number;
    serviceType: 'All' | 'Single' | 'Braces' | 'System';
    duration: number;
    selected: boolean;
  }
}
