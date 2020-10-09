import moment from 'moment';
import S3 from 'react-aws-s3';

import { imageLambdaUrl } from './api/dataAPI';
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
  const topPosition =
    distanceFromTop + fromHeightDiff + fromHourRect.height / 2;

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
