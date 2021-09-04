import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setIsCalendarLoading } from '../../../../../redux/actions/calendar';
import { updateAppointmentsSelector } from '../../../../../redux/selectors/rootSelector';
import { getDays } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';
import { getPeriodSchedules } from "../../../../../middleware/api/schedules";
import ScheduleItem from './ScheduleItem';
import styles from './CalendarMonthView.module.scss';

const CalendarMonthView = ({ viewDate, doctorId, onDateClick }) => {
  const dispatch = useDispatch();
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [schedules, setSchedules] = useState([]);
  const [monthDays, setMonthDays] = useState([]);

  useEffect(() => {
    if (viewDate != null && doctorId != null) {
      setMonthDays(getDays(viewDate));
      setSchedules([]);
      fetchSchedules();
    }
  }, [viewDate, doctorId, updateAppointments]);

  const fetchSchedules = async () => {
    if (doctorId == null) {
      return;
    }
    dispatch(setIsCalendarLoading(true));
    try {
      const date = moment(viewDate).format('YYYY-MM-DD')
      const response = await getPeriodSchedules(doctorId, date, 'month')
      const newSchedules = [];
      for (let prop in response.data) {
        const date = moment(`${prop}`, 'YYYY-MM-DD').format('DD');
        newSchedules.push({ date, schedules: response.data[prop] });
      }
      setSchedules(newSchedules);
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setIsCalendarLoading(false));
    }
  };

  const rowsCount = monthDays.length / 7;
  const calendarRect = typeof document !== 'undefined' ? document
    .getElementById('calendar-content')
    ?.getBoundingClientRect() : { height: 1 };

  const handleDayClick = (day) => {
    const date = moment(day.fullDate, 'YYYY-DD-MM').toDate();
    onDateClick(date, true);
  };

  const getSchedules = (day) => {
    return schedules.find((item) => item.date === day.date)?.schedules || [];
  };

  const renderSchedule = (schedule) => {
    return (
      <ScheduleItem
        appointment={schedule}
        hidden={schedule.isHidden}
        showHour={false}
      />
    );
  };

  const renderDayItem = (day) => {
    const daySchedules = getSchedules(day);
    return (
      <div
        role='button'
        tabIndex={0}
        onClick={() => handleDayClick(day)}
        className={clsx(styles['item-data-container'], day.isSameDay && styles['current-date'])}
        style={{ height: calendarRect?.height / rowsCount }}
        key={`${day.date}-${day.isCurrent}-${day.month}`}
      >
        <span
          className={clsx(
            styles['item-text'],
            styles['month-day'],
            !day.isCurrent && styles['next-month'],
          )}
        >
          {day.date}
        </span>
        {day.isCurrent && (
          <div className={styles['appointments-container']}>
            {daySchedules.slice(0, 3).map(renderSchedule)}
            {daySchedules.length > 3 && (
              <div className={styles['view-more-container']}>
                <span className={styles['view-more-button']}>
                  {textForKey('View more')} ({daySchedules.length - 3})
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return <div className={styles['month-view']}>{monthDays.map(renderDayItem)}</div>;
};

export default CalendarMonthView;

CalendarMonthView.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
};

CalendarMonthView.defaultProps = {
  onDateClick: () => null,
};
