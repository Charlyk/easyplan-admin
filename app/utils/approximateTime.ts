const approximateTime = (timeString: string, step: number) => {
  const [hours, minutes] = timeString.split(':');

  const totalMinutes = parseInt(minutes);
  let approxMinutes: number;
  if (totalMinutes % step !== 0) {
    const remainder = totalMinutes % step;
    approxMinutes = totalMinutes - remainder + 5;
  } else {
    approxMinutes = totalMinutes;
  }

  let returnMinutes: string;
  let returnHours: string;

  if (String(approxMinutes).length === 1) {
    returnMinutes = '0' + approxMinutes;
    returnHours = hours;
  } else if (approxMinutes === 60) {
    returnMinutes = '00';
    const addedHoursString = String(parseInt(hours) + 1);

    returnHours =
      addedHoursString.length === 1
        ? (returnHours = '0' + addedHoursString)
        : addedHoursString;
  } else {
    returnMinutes = String(approxMinutes);
    returnHours = hours;
  }

  return `${returnHours}:${returnMinutes}`;
};

export default approximateTime;
