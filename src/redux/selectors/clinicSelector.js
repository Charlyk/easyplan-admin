import { createSelector } from 'reselect';

import { Role } from '../../utils/constants';

export const clinicSelector = state => state.clinic;

export const clinicDetailsSelector = createSelector(
  clinicSelector,
  state => state.clinic,
);

export const clinicUsersSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.users,
);

export const allCurrenciesSelector = createSelector(
  clinicDetailsSelector,
  state => state.allCurrencies,
);

export const clinicCurrencySelector = createSelector(
  clinicDetailsSelector,
  state => state.currency,
);

export const clinicExchangeRatesSelector = createSelector(
  clinicDetailsSelector,
  state => {
    const currencies = state.availableCurrencies || [];
    const clinicCurrency = state.allCurrencies?.find(
      item => item.id === state.currency,
    );
    if (clinicCurrency == null) {
      return currencies;
    }
    currencies.unshift({
      currency: clinicCurrency.id,
      currencyName: clinicCurrency.name,
      value: 1,
    });
    return currencies;
  },
);

export const clinicExchangeRatesUpdateRequiredSelector = createSelector(
  clinicDetailsSelector,
  state => state.updateExchangeRates,
);

export const clinicDoctorsSelector = createSelector(
  clinicUsersSelector,
  users => users.filter(item => item.roleInClinic === Role.doctor),
);

export const clinicActiveDoctorsSelector = createSelector(
  clinicDoctorsSelector,
  doctors =>
    doctors
      .filter(item => !item.isHidden)
      .map(item => ({
        ...item,
        fullName: `${item.firstName} ${item.lastName}`,
      })),
);

export const clinicServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.services?.filter(item => !item.deleted) || [],
);

export const clinicAllServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.services || [],
);

export const clinicBracesServicesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic?.services?.filter(item => item.serviceType === 'Braces'),
);

export const clinicBracesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic.braces,
);

export const clinicEnabledBracesSelector = createSelector(
  clinicDetailsSelector,
  clinic => clinic?.braces?.filter(item => item.isEnabled) || [],
);
