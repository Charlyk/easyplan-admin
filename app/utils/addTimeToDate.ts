import { setHours, setMinutes, formatISO } from 'date-fns';

const addTimeToDate = (
  date: string | Date | number,
  hours: number | string,
  minutes: number | string,
) => {
  const currentDate = new Date(date);
  const dateWithHoursAdded = setHours(currentDate, Number(hours));
  const dateWithMinutesAdded = setMinutes(dateWithHoursAdded, Number(minutes));

  return formatISO(dateWithMinutesAdded, {
    format: 'extended',
    representation: 'complete',
  });
};

export default addTimeToDate;
