import moment from 'moment';
import S3 from 'react-aws-s3';
import uuid from 'react-uuid';

import { setCurrentUser } from '../redux/actions/actions';
import { setClinic } from '../redux/actions/clinicActions';
import { clinicDetailsSelector } from '../redux/selectors/clinicSelector';
import dataAPI, { imageLambdaUrl } from './api/dataAPI';
import { env, S3Config } from './constants';
import { textForKey } from './localization';
import authManager from './settings/authManager';
import sessionManager from './settings/sessionManager';

export function createHoursList() {
  return [].concat(
    ...Array.from(Array(24), (_, hour) => [moment({ hour }).format('HH:mm')]),
  );
}

/**
 * Calculate and return appointment position
 * @param {[string]} appointment
 * @param {string} parentId
 * @param {number} minHeight
 * @param {number} minTop
 * @return {{top: number, height: number}}
 */
export function getAppointmentTop(
  [startHour, endHour],
  parentId,
  minHeight = 32,
  minTop = 0,
) {
  if (!startHour || !endHour) {
    return {
      top: minTop,
      height: minHeight,
    };
  }

  const fromHourComponents = startHour.split(':');
  const toHourComponents = endHour.split(':');

  const parentRect = document.getElementById(parentId).getBoundingClientRect();

  const fromHourRect = document
    .getElementById(`${fromHourComponents[0]}:00`)
    .getBoundingClientRect();

  const toHourRect = document
    .getElementById(`${toHourComponents[0]}:00`)
    .getBoundingClientRect();
  // calculate start hour minutes height
  const fromMinutes = parseInt(fromHourComponents[1]);
  const fromMinutesPercentage = (fromMinutes / 60) * 100;
  const fromHeightDiff = (fromMinutesPercentage / 100) * fromHourRect.height;

  // calculate end hour minutes height
  const toMinutes = parseInt(toHourComponents[1]);
  const toMinutesPercentage = (toMinutes / 60) * 100;
  const toHeightDiff = (toMinutesPercentage / 100) * toHourRect.height;

  // calculate top position
  const distanceFromTop = fromHourRect.top - parentRect.top;
  const topPosition = distanceFromTop + fromHeightDiff + minTop;

  // calculate item height
  const height = Math.abs(
    toHourRect.top + toHeightDiff - (fromHourRect.top + fromHeightDiff),
  );

  // return new position and height
  return { top: topPosition, height };
}

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

/**
 * Send user action to server
 * @param {string} action
 * @param {string?} details
 */
export function logUserAction(action, details) {
  dataAPI.sendAction(action, details);
}

export const getCurrentWeek = date => {
  const currentDate = moment(date);
  const weekStart = currentDate.clone().startOf('isoWeek');
  const days = [];
  for (let i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, 'days'));
  }
  return days;
};

export const firstDayOfMonth = viewDate => {
  return moment(viewDate)
    .startOf('month')
    .weekday();
};

export const lastDayOfMonth = viewDate => {
  return moment(viewDate)
    .endOf('month')
    .weekday();
};

export const getDays = viewDate => {
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
    actions[type] = payload => ({ type: type, payload });
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

export const fetchClinicData = () => async dispatch => {
  // fetch clinic details
  const clinicResponse = await dataAPI.fetchClinicDetails();
  if (!clinicResponse.isError) {
    dispatch(setClinic(clinicResponse.data));
  }
};

export const getServiceName = service => {
  let name = service.name;
  if (service.toothId != null) {
    name = `${name} ${service.toothId}`;
  }
  if (service.destination != null) {
    name = `${name} (${textForKey(service.destination)})`;
  }
  return name;
};

export const checkShouldAnimateSchedule = schedule => (dispatch, getState) => {
  if (schedule != null) {
    const appState = getState();
    const currentClinic = clinicDetailsSelector(appState);
    const now = moment();
    const scheduleTime = moment(schedule.dateAndTime);
    const duration = moment.duration(scheduleTime.diff(now));
    const minutes = duration.asMinutes();
    return (
      minutes > 0 &&
      minutes <= currentClinic.notifyUpcomingAppointmentTimer &&
      schedule.status === 'Pending'
    );
  }
  return false;
};

/**
 * Add environment to the link
 * @param {string} link
 * @return {string|*}
 */
export const updateLink = link => {
  if (env.length > 0) {
    return link.includes('?') ? `${link}&env=${env}` : `${link}?env=${env}`;
  } else {
    return link;
  }
};

export const handleUserAuthenticated = (
  { user, token },
  callback = () => null,
) => dispatch => {
  authManager.setUserToken(token);
  authManager.setUserId(user.id);
  const selectedClinic =
    user.clinics.length > 0
      ? user.clinics.find(it => it.isSelected) || user.clinics[0]
      : { clinicId: -1 };
  sessionManager.setSelectedClinicId(selectedClinic.clinicId);
  setTimeout(() => {
    dispatch(setCurrentUser(user));
    const selectedClinic = user.clinics.find(
      item => item.clinicId === sessionManager.setSelectedClinicId(),
    );
    if (selectedClinic != null) {
      dispatch(fetchClinicData());
    }
    callback();
  }, 500);
};

export const colorShade = (col, amt) => {
  col = col.replace(/^#/, '');
  if (col.length === 3)
    col = col[0] + col[0] + col[1] + col[1] + col[2] + col[2];

  let [r, g, b] = col.match(/.{2}/g);
  [r, g, b] = [
    parseInt(r, 16) + amt,
    parseInt(g, 16) + amt,
    parseInt(b, 16) + amt,
  ];

  r = Math.max(Math.min(255, r), 0).toString(16);
  g = Math.max(Math.min(255, g), 0).toString(16);
  b = Math.max(Math.min(255, b), 0).toString(16);

  const rr = (r.length < 2 ? '0' : '') + r;
  const gg = (g.length < 2 ? '0' : '') + g;
  const bb = (b.length < 2 ? '0' : '') + b;

  return `#${rr}${gg}${bb}`;
};
