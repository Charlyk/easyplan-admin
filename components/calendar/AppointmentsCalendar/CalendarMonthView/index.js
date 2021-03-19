import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { setIsCalendarLoading } from '../../../../redux/actions/calendar';
import { updateAppointmentsSelector } from '../../../../redux/selectors/rootSelector';
import dataAPI from '../../../../utils/api/dataAPI';
import { Action } from '../../../../utils/constants';
import { getDays, logUserAction } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import ScheduleItem from '../../../../src/pages/Calendar/ScheduleItem';
import styles from '../../../../styles/CalendarMonthView.module.scss';

const CalendarMonthView = ({ opened, viewDate, doctorId, onDateClick }) => {
  const dispatch = useDispatch();
  const updateAppointments = useSelector(updateAppointmentsSelector);
  const [isClosed, setIsClosed] = useState(!opened);
  const [schedules, setSchedules] = useState([]);
  const [monthDays, setMonthDays] = useState([]);

  useEffect(() => {
    if (opened) {
      logUserAction(
        Action.ViewAppointments,
        JSON.stringify({ mode: 'Month', doctorId }),
      );
    }
    if (viewDate != null && doctorId != null && opened) {
      setMonthDays(getDays(viewDate));
      setSchedules([]);
      fetchSchedules();
    }
  }, [viewDate, doctorId, opened, updateAppointments]);

  const fetchSchedules = async () => {
    dispatch(setIsCalendarLoading(true));
    const response = await dataAPI.fetchMonthSchedules(doctorId, viewDate);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      const newSchedules = [];
      for (let prop in response.data) {
        const date = moment(`${prop}`, 'YYYY-MM-DD').format('DD');
        newSchedules.push({ date, schedules: response.data[prop] });
      }
      setSchedules(newSchedules);
    }
    dispatch(setIsCalendarLoading(false));
  };

  useEffect(() => {
    setIsClosed(!opened);
  }, [opened]);

  if (isClosed) return null;

  const rowsCount = monthDays.length / 7;
  const calendarRect = document
    .getElementById('calendar-content')
    ?.getBoundingClientRect();

  const handleDayClick = (day) => {
    const date = moment(day.fullDate, 'YYYY-DD-MM').toDate();
    onDateClick(date);
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
  opened: PropTypes.bool.isRequired,
  viewDate: PropTypes.instanceOf(Date),
  doctorId: PropTypes.number,
  onDateClick: PropTypes.func,
};

CalendarMonthView.defaultProps = {
  onDateClick: () => null,
};
