import { useCallback } from 'react';
import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { clinicTimeZoneSelector } from 'redux/selectors/appDataSelector';
import { AppLocale } from 'types';
import { DateLocales } from './constants';
import { getAppLanguage } from './localization';

const useDateFormatter = (locale: AppLocale | null | undefined = null) => {
  const timeZone = useSelector(clinicTimeZoneSelector);
  const appLocale: AppLocale = getAppLanguage();
  return useCallback(
    (
      date: string | Date,
      withHour = true,
      specificFormat: string | null | undefined = null,
    ) => {
      const dateFormat =
        specificFormat || (withHour ? 'dd.MM.yyyy HH:mm' : 'dd.MM.yyyy');
      if (typeof date === 'string') {
        return formatInTimeZone(parseISO(date), timeZone, dateFormat, {
          locale: DateLocales[locale ?? appLocale],
        });
      } else {
        return formatInTimeZone(date, timeZone, dateFormat, {
          locale: DateLocales[locale ?? appLocale],
        });
      }
    },
    [timeZone, locale, appLocale],
  );
};

export default useDateFormatter;
