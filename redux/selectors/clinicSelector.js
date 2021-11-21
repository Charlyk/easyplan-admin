import moment from 'moment-timezone';
import { Role } from 'app/utils/constants';

export const clinicTimeZoneSelector = (clinic) =>
  clinic?.timeZone || moment.tz.guess(true);

export const clinicCurrencySelector = (clinic) => clinic.currency;

export const availableCurrenciesSelector = (clinic) => {
  return clinic?.availableCurrencies != null
    ? [...clinic.availableCurrencies.map((item) => item.currency)]
    : [];
};

export const clinicActiveDoctorsSelector = (clinic) => {
  return (
    clinic?.users
      ?.filter((item) => item.roleInClinic === Role.doctor && !item.isHidden)
      ?.map((item) => ({
        ...item,
        fullName: `${item.firstName} ${item.lastName}`,
      })) || []
  );
};

export const clinicServicesSelector = (clinic) =>
  clinic.services?.filter((item) => !item.deleted) || [];

export const clinicBracesServicesSelector = (clinic) =>
  clinic?.services?.filter((item) => item.serviceType === 'Braces');

export const clinicBracesSelector = (clinic) => clinic.braces;

export const clinicEnabledBracesSelector = (clinic) =>
  clinic?.braces?.filter((item) => item.isEnabled) || [];

export const isExchangeRatesUpdateRequiredSelector = (state) =>
  state.clinic.updateExchangeRates;
