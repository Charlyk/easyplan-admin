import moment from 'moment-timezone';
import S3 from 'react-aws-s3';
import uuid from 'react-uuid';

import { imageLambdaUrl } from '../eas.config';
import { env, S3Config } from './constants';
import { textForKey } from './localization';
import { baseAppUrl, isDev } from "../eas.config";
import Router from "next/router";
import { toast } from "react-toastify";
import cookie from "cookie";

/**
 * Upload a file to AWS
 * @param {string} path
 * @param {Object} file
 * @param {boolean} tmp
 * @return {Promise<Object|null>}
 */
export async function uploadFileToAWS(path, file, tmp = false) {
  const s3client = new S3(S3Config(path));
  const fileName = `${tmp ? 'tmp_' : ''}${uuid()}-${file.name}`;
  return await s3client.uploadFile(file, fileName);
}

/**
 * convert image url to lambda url
 * @param {string} imageUrl
 * @param {number} width
 * @return {string}
 */
export function urlToLambda(imageUrl, width = 50) {
  const url = new URL(imageUrl);
  return `${imageLambdaUrl}${url.pathname}?width=${width}`;
}

export const getCurrentWeek = (date) => {
  const currentDate = moment(date);
  const weekStart = currentDate.clone().startOf('isoWeek');
  const days = [];
  for (let i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, 'days'));
  }
  return days;
};

export const firstDayOfMonth = (viewDate) => {
  return moment(viewDate).startOf('month').weekday();
};

export const lastDayOfMonth = (viewDate) => {
  return moment(viewDate).endOf('month').weekday();
};

export const getDays = (viewDate) => {
  const currentMonth = moment(viewDate);
  const daysInCurrentMonth = currentMonth.daysInMonth();
  const currentMonthIndex = currentMonth.month();
  const previousMonthIndex = currentMonth.subtract(1, 'month').month();
  const nextMonthIndex = currentMonth.add(1, 'month').month();

  const daysInPreviousMonth = moment({
    month: previousMonthIndex,
  }).daysInMonth();
  const firstDay = firstDayOfMonth(viewDate);
  const lastDay = lastDayOfMonth(viewDate);

  // add last days of previous month
  const startDays = [];
  for (let i = 0; i < firstDay; i++) {
    const date = moment({
      year: currentMonth.year(),
      month: previousMonthIndex,
      day: daysInPreviousMonth - i,
    });
    const isSameDay = date.isSame(moment(), 'day');
    startDays.unshift({
      date: date.format('DD'),
      fullDate: date.format('YYYY-DD-MM'),
      month: previousMonthIndex,
      isCurrent: false,
      isSameDay,
    });
  }

  // add current month days
  const daysInMonth = [];
  for (let i = 0; i < daysInCurrentMonth; i++) {
    const date = moment({
      year: currentMonth.year(),
      month: currentMonthIndex,
      day: i + 1,
    });
    const isSameDay = date.isSame(moment(), 'day');
    daysInMonth.push({
      date: date.format('DD'),
      fullDate: date.format('YYYY-DD-MM'),
      month: currentMonthIndex,
      isCurrent: true,
      isSameDay,
    });
  }

  // add next month days
  const endDays = [];
  for (let i = 0; i < 6 - lastDay; i++) {
    const date = moment({
      year: currentMonth.year(),
      month: nextMonthIndex,
      day: i + 1,
    });
    const isSameDay = date.isSame(moment(), 'day');
    endDays.push({
      date: date.format('DD'),
      fullDate: date.format('YYYY-DD-MM'),
      month: nextMonthIndex,
      isCurrent: false,
      isSameDay,
    });
  }
  return [...startDays, ...daysInMonth, ...endDays];
};

export function generateReducerActions(types) {
  const actions = {};
  for (const type of Object.keys(types)) {
    actions[type] = (payload) => ({ type: type, payload });
  }
  return actions;
}

// this function takes an array of date ranges in this format:
// [{ start: Date, end: Date}]
// the array is first sorted, and then checked for any overlap

export function overlap(dateRanges) {
  const sortedRanges = dateRanges.sort((previous, current) => {
    // get the start date from previous and current
    const previousTime = previous.start.getTime();
    const currentTime = current.start.getTime();

    // if the previous time is the same as the current time
    if (previousTime === currentTime) {
      return 0;
    }

    // if the previous is earlier than the current
    if (previousTime < currentTime) {
      return -1;
    }

    // if the previous time is later than the current time
    return 1;
  });

  // return the final results
  return sortedRanges.reduce(
    (result, current, idx, arr) => {
      // get the previous range
      if (idx === 0) {
        return result;
      }
      const previous = arr[idx - 1];

      // check for any overlap
      const previousEnd = previous.end.getTime();
      const currentStart = current.start.getTime();
      const overlap = previousEnd >= currentStart;

      // store the result
      if (overlap) {
        // yes, there is overlap
        result.overlap = true;
        // store the specific ranges that overlap
        result.ranges.push({
          previous: previous,
          current: current,
        });
      }

      return result;

      // seed the reduce
    },
    { overlap: false, ranges: [] },
  );
}

export const getServiceName = (service) => {
  let name = service.name;
  if (service.toothId != null) {
    name = `${name} ${service.toothId}`;
  }
  if (service.destination != null) {
    name = `${name} (${textForKey(service.destination)})`;
  }
  return name;
};

/**
 * Add environment to the link
 * @param {string} link
 * @return {string|*}
 */
export const updateLink = (link) => {
  if (env.length > 0) {
    return link.includes('?') ? `${link}&env=${env}` : `${link}?env=${env}`;
  } else {
    return link;
  }
};

export function roundToTwo(num) {
  return +(Math.round(num + 'e+2') + 'e-2');
}

/**
 * Format number as price with currency
 * @param {number} amount
 * @param {string} currency
 * @return {string}
 */
export const formattedAmount = (amount, currency) => {
  return Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: currency || 'MDL',
  }).format(amount);
};

export const adjustValueToNumber = (newValue, maxAmount) => {
  if (newValue.length === 0) {
    newValue = '0';
  }

  if (newValue.length > 1 && newValue[0] === '0') {
    newValue = newValue.replace(/^./, '');
  }

  newValue = parseFloat(newValue);

  if (newValue < 0) {
    newValue = 0;
  }

  if (newValue > maxAmount) {
    newValue = maxAmount;
  }
  return roundToTwo(newValue);
};

export const handleRequestError = async (error, req, res) => {
  const status = error?.response?.status;
  const statusText = error?.response?.statusText || textForKey('something_went_wrong');
  if (status === 401) {
    if (req && req.url !== '/login') {
      res.writeHead(302, { Location: `${baseAppUrl}/login` });
      res.end();
    } else if (!req && Router?.asPath !== '/login') {
      await Router?.replace('/login');
    }
  } else {
    toast.error(statusText)
  }
}

export const getClinicExchangeRates = (currentClinic) => {
  const currencies = currentClinic.availableCurrencies || [];
  const clinicCurrency = currentClinic.allCurrencies?.find(
    (item) => item.id === currentClinic.currency,
  );
  if (clinicCurrency == null) {
    return currencies;
  }
  if (!currencies.some((it) => it.currency === clinicCurrency.id)) {
    currencies.unshift({
      currency: clinicCurrency.id,
      currencyName: clinicCurrency.name,
      value: 1,
    });
  }
  return currencies;
}

export function setCookies(res, authToken, clinicId) {
  const cookieOpts = {
    httpOnly: true,
    secure: !isDev,
    sameSite: 'strict',
    maxAge: 36000,
    path: '/'
  }
  const tokenCookie = cookie.serialize('auth_token', String(authToken), cookieOpts);
  const clinicCookie = cookie.serialize('clinic_id', String(clinicId) || '-1', cookieOpts);
  res.setHeader('Set-Cookie', [tokenCookie, clinicCookie]);
}