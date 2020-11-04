import moment from 'moment';
import S3 from 'react-aws-s3';

import {
  setClinic,
  setClinicDoctors,
  setClinicServices,
} from '../redux/actions/clinicActions';
import { clinicDetailsSelector } from '../redux/selectors/clinicSelector';
import dataAPI, { imageLambdaUrl } from './api/dataAPI';
import { S3Config } from './constants';

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
 * @return {Promise<Object|null>}
 */
export async function uploadFileToAWS(path, file) {
  const s3client = new S3(S3Config(path));
  return await s3client.uploadFile(file, file.name);
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
  const days = [];
  const currentMonth = moment(viewDate);
  const daysInCurrentMonth = currentMonth.daysInMonth();
  const currentMonthIndex = currentMonth.month();
  const previousMonthIndex = moment({ month: currentMonthIndex - 1 }).month();
  const nextMonthIndex = currentMonth.add('months', 1).month();

  const daysInPreviousMonth = moment({
    month: previousMonthIndex,
  }).daysInMonth();
  const firstDay = firstDayOfMonth(viewDate);
  const lastDay = lastDayOfMonth(viewDate);

  // add last days of previous month
  for (let i = 0; i < firstDay; i++) {
    const date = moment({
      month: previousMonthIndex,
      day: daysInPreviousMonth - i,
    });
    days.unshift({
      date: date.format('DD'),
      fullDate: date.format('YYYY-DD-MM'),
      month: previousMonthIndex,
      isCurrent: false,
    });
  }

  // add current month days
  for (let i = 0; i < daysInCurrentMonth; i++) {
    const date = moment({
      month: currentMonthIndex,
      day: i + 1,
    });
    days.push({
      date: date.format('DD'),
      fullDate: date.format('YYYY-DD-MM'),
      month: currentMonthIndex,
      isCurrent: true,
    });
  }

  // add next month days
  for (let i = 0; i < 6 - lastDay; i++) {
    const date = moment({
      month: nextMonthIndex,
      day: i + 1,
    });
    days.push({
      date: date.format('DD'),
      fullDate: date.format('YYYY-DD-MM'),
      month: nextMonthIndex,
      isCurrent: false,
    });
  }
  return days;
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
  // fetch clinic doctors
  const doctorsResponse = await dataAPI.getClinicDoctors();
  if (!doctorsResponse.isError) {
    dispatch(setClinicDoctors(doctorsResponse.data));
  }

  // fetch clinic services
  const servicesResponse = await dataAPI.fetchServices(null);
  if (!servicesResponse.isError) {
    dispatch(setClinicServices(servicesResponse.data));
  }
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
      minutes > 0 && minutes <= currentClinic.notifyUpcomingAppointmentTimer
    );
  }
  return false;
};
