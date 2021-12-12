import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';

import getLastHourDate from './getLastHourDate';

const moment = extendMoment(Moment);

/**
 * Check if a given time is out of bounds fro a specific dates
 * @param time
 * @param hours
 * @param date
 * @return {boolean}
 */
const isOutOfBounds = (time, hours, date) => {
  const lastHourDate = getLastHourDate(hours, date);
  if (time == null || lastHourDate == null) {
    return true;
  }
  const scheduleTime = moment(time);
  return scheduleTime.isAfter(lastHourDate);
};

export default isOutOfBounds;
