import moment from "moment-timezone";

export const firstDayOfMonth = (viewDate) => {
  return moment(viewDate).startOf('month').weekday();
};

export const lastDayOfMonth = (viewDate) => {
  return moment(viewDate).endOf('month').weekday();
};

const getDays = (viewDate) => {
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
    const isSameDay = date.isSame(moment(), 'date');
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
    const isSameDay = date.isSame(moment(), 'date');
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
    const isSameDay = date.isSame(moment(), 'date');
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

export default getDays;
