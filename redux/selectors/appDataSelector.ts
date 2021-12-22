import orderBy from 'lodash/orderBy';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Role } from 'app/utils/constants';
import { ReduxState } from 'redux/types';
import doctors from '../../pages/api/analytics/doctors';
import { ExchangeRate } from '../../types';

export const appDataSelector = (state: ReduxState) => state.appData;

export const currentClinicSelector = createSelector(
  appDataSelector,
  (appData) => appData.currentClinic,
);

export const currentUserSelector = createSelector(
  appDataSelector,
  (appData) => appData.currentUser,
);

export const authTokenSelector = createSelector(
  appDataSelector,
  (appData) => appData.authToken,
);

export const clinicCabinetsSelector = createSelector(
  currentClinicSelector,
  (currentClinic) => currentClinic?.cabinets ?? [],
);

export const hasCabinetsSelector = createSelector(
  currentClinicSelector,
  (currentClinic) => currentClinic?.cabinets?.length > 0,
);

export const clinicDoctorsSelector = createSelector(
  currentClinicSelector,
  (currentClinic) =>
    (currentClinic?.users ?? []).filter(
      (user) => user.roleInClinic === Role.doctor,
    ),
);

export const clinicCurrencySelector = createSelector(
  currentClinicSelector,
  (clinic) => clinic.currency,
);

export const availableCurrenciesSelector = createSelector(
  currentClinicSelector,
  (clinic) =>
    clinic?.availableCurrencies != null
      ? [
          ...clinic.availableCurrencies.map((item) => item.currency),
          clinic.currency,
        ]
      : [],
);

export const clinicServicesSelector = createSelector(
  currentClinicSelector,
  (clinic) => clinic.services?.filter((item) => !item.deleted) || [],
);

export const isAppInitializedSelector = createSelector(
  appDataSelector,
  (data) => data.isAppInitialized,
);

export const clinicTimeZoneSelector = createSelector(
  currentClinicSelector,
  (clinic) => clinic?.timeZone || moment.tz.guess(true),
);

export const clinicBracesServicesSelector = createSelector(
  currentClinicSelector,
  (clinic) => clinic?.services?.filter((item) => item.serviceType === 'Braces'),
);

export const clinicEnabledBracesSelector = createSelector(
  currentClinicSelector,
  (clinic) => clinic?.braces?.filter((item) => item.isEnabled) || [],
);

export const clinicBracesSelector = createSelector(
  currentClinicSelector,
  (clinic) => clinic.braces,
);

export const userClinicSelector = createSelector(
  currentUserSelector,
  currentClinicSelector,
  (user, clinic) => user?.clinics.find((it) => it.clinicId === clinic.id),
);

export const activeClinicDoctorsSelector = createSelector(
  clinicDoctorsSelector,
  (doctors) => {
    console.log(doctors);
    return orderBy(
      (doctors ?? []).filter(
        (user) => user.roleInClinic === Role.doctor && !user.isHidden,
      ),
      ['fullName'],
      ['asc'],
    );
  },
);

export const calendarDoctorsSelector = createSelector(
  activeClinicDoctorsSelector,
  (doctors) => (doctors ?? []).filter((item) => item.showInCalendar),
);

export const doctorsForScheduleSelector = createSelector(
  activeClinicDoctorsSelector,
  (users) => users.filter((user) => !user.isInVacation),
);

export const clinicExchangeRatesSelector = createSelector(
  currentClinicSelector,
  (currentClinic) => {
    const currencies = [...currentClinic.availableCurrencies] || [];
    const clinicCurrency = currentClinic.allCurrencies?.find(
      (item) => item.id === currentClinic.currency,
    );
    if (clinicCurrency == null) {
      return currencies;
    }
    if (!currencies.some((it) => it.currency === clinicCurrency.id)) {
      const rate: ExchangeRate = {
        currency: clinicCurrency.id,
        currencyName: clinicCurrency.name,
        value: 1,
        created: moment().format('YYYY-MM-DD'),
      };
      currencies.unshift(rate);
    }
    return currencies;
  },
);

export const isUpdatingProfileSelector = createSelector(
  appDataSelector,
  (data) => data.isUpdatingProfile,
);
