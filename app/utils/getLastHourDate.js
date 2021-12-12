import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';

const moment = extendMoment(Moment);

const getLastHourDate = (hours, viewDate) => {
  const lastHour = hours[hours.length - 1];
  if (lastHour == null) {
    return moment();
  }
  const [maxHour, maxMinute] = lastHour.split(':');
  return moment(viewDate)
    .set('hour', parseInt(maxHour))
    .set('minute', parseInt(maxMinute));
};

export default getLastHourDate;
