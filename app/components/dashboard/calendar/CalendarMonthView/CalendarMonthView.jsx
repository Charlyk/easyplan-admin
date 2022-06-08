import React, { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import NotificationsContext from 'app/context/notificationsContext';
import areComponentPropsEqual from 'app/utils/areComponentPropsEqual';
import getDays from 'app/utils/getDays';
import { getPeriodSchedules } from 'middleware/api/schedules';
import { setIsCalendarLoading } from 'redux/actions/calendar';
import { updateAppointmentsSelector } from 'redux/selectors/rootSelector';
import styles from './CalendarMonthView.module.scss';

const ScheduleItem = dynamic(() => import('./ScheduleItem'));

const CalendarMonthView = ({ viewDate, doctorId, onDateClick }) => {
  const textForKey = useTranslate();
  const toast = useContext(NotificationsContext);
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
      const date = moment(viewDate).format('YYYY-MM-DD');
      const response = await getPeriodSchedules(doctorId, date, 'month');
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
  const calendarRect =
    typeof document !== 'undefined'
      ? document.getElementById('calendar-content')?.getBoundingClientRect()
      : { height: 1 };

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
        key={schedule.id}
        appointment={schedule}
        hidden={schedule.isHidden}
        showHour={false}
      />
    );
  };

  const renderDayItem = (day) => {
    const daySchedules = getSchedules(day);
    return (
      <Box
        onClick={() => handleDayClick(day)}
        className={clsx(
          styles.itemDataContainer,
          day.isSameDay && styles.currentDate,
        )}
        style={{ height: calendarRect?.height / rowsCount - 3 }}
        key={`${day.date}-${day.isCurrent}-${day.month}`}
      >
        <span
          className={clsx(
            styles.itemText,
            styles.monthDay,
            !day.isCurrent && styles.nextMonth,
          )}
        >
          {day.date}
        </span>
        {day.isCurrent && (
          <div className={styles.appointmentsContainer}>
            {daySchedules.slice(0, 3).map(renderSchedule)}
            {daySchedules.length > 3 && (
              <div className={styles.viewMoreContainer}>
                <span className={styles.viewMoreButton}>
                  {textForKey('view_more')} ({daySchedules.length - 3})
                </span>
              </div>
            )}
          </div>
        )}
      </Box>
    );
  };

  return <div className={styles.monthView}>{monthDays.map(renderDayItem)}</div>;
};

export default React.memo(CalendarMonthView, areComponentPropsEqual);

CalendarMonthView.propTypes = {
  viewDate: PropTypes.instanceOf(Date),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
};

CalendarMonthView.defaultProps = {
  onDateClick: () => null,
};
