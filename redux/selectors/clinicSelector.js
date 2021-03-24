import moment from 'moment-timezone';
import { Role } from '../../utils/constants';

export const clinicTimeZoneSelector = (clinic) => clinic?.timeZone || moment.tz.guess(true);

export const hasSMSAliasSelector = (clinic) => clinic.smsAlias != null;

export const clinicUsersSelector = (clinic) => clinic.users;

export const allCurrenciesSelector = (clinic) => clinic.allCurrencies;

export const clinicCurrencySelector = (clinic) => clinic.currency;

export const availableCurrenciesSelector = (clinic) =>
  clinic?.availableCurrencies != null
    ? [
      ...clinic.availableCurrencies.map((item) => item.currency),
      clinic.currency,
    ]
    : [];

export const clinicActiveDoctorsSelector = (clinic) => {
  return clinic.users
    .filter((item) => item.roleInClinic === Role.doctor && !item.isHidden)
    .map((item) => ({
      ...item,
      fullName: `${item.firstName} ${item.lastName}`,
    }));
}

export const clinicServicesSelector = (clinic) =>
  clinic.services?.filter((item) => !item.deleted) || [];

export const clinicAllServicesSelector = (clinic) =>
  clinic.services?.filter((item) => item.serviceType !== 'System') || [];

export const clinicBracesServicesSelector = (clinic) =>
  clinic?.services?.filter((item) => item.serviceType === 'Braces');

export const clinicBracesSelector = (clinic) => clinic.braces;

export const clinicEnabledBracesSelector = (clinic) =>
  clinic?.braces?.filter((item) => item.isEnabled) || [];
