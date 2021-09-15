import moment from "moment-timezone";

/**
 * Get current week days
 * @param {Date} date
 * @return {Moment[]}
 */
const getCurrentWeek = (date) => {
  const currentDate = moment(date);
  const weekStart = currentDate.clone().startOf('isoWeek');
  const days = [];
  for (let i = 0; i <= 6; i++) {
    days.push(moment(weekStart).add(i, 'days'));
  }
  return days;
};

export default getCurrentWeek;
