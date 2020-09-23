import moment from 'moment';

export function createHoursList() {
  return [].concat(
    ...Array.from(Array(24), (_, hour) => [moment({ hour }).format('HH:mm')]),
  );
}

export function createMonthDays() {
  const currentMonth = moment().month();
  const currentMonthDays = moment({ month: currentMonth }).daysInMonth();
  const nextMonthDays = moment()
    .add('months', 1)
    .daysInMonth();

  const currentDates = [].concat(
    ...Array.from(Array(currentMonthDays), (_, day) => [
      {
        date: moment({ day: day + 1 }).format('DD'),
        isCurrent: true,
      },
    ]),
  );
  const nextDays = [].concat(
    ...Array.from(Array(nextMonthDays), (_, day) => [
      {
        date: moment({ day: day + 1 }).format('DD'),
        isCurrent: false,
      },
    ]),
  );

  const daysDiff = 35 - currentDates.length;
  for (let i = 0; i < daysDiff; i++) {
    currentDates.push(nextDays[i]);
  }

  return currentDates;
}

/**
 * Calculate and return appointment position
 * @param {{ startHour: string, endHour: string }} appointment
 * @param {string} parentId
 * @param {number} minHeight
 * @param {number} minTop
 * @return {{top: number, height: number}}
 */
export function getAppointmentTop(
  appointment,
  parentId,
  minHeight = 32,
  minTop = 0,
) {
  if (!appointment) {
    return {
      top: minTop,
      height: minHeight,
    };
  }
  const { startHour, endHour } = appointment;

  if (startHour == null || endHour == null)
    return { top: minTop, height: minHeight };

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
  const distanceFromStart = toHourRect.top - fromHourRect.top;
  const height = distanceFromStart + toHeightDiff;

  // return new position and height
  return { top: topPosition, height };
}
