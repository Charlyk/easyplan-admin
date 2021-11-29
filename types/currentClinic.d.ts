import ClinicUser from './clinicUser';

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
