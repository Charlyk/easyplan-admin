import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import dataAPI from '../../../../../utils/api/dataAPI';
import { Action } from '../../../../../utils/constants';
import { getDays, logUserAction } from '../../../../../utils/helperFuncs';
import { textForKey } from '../../../../../utils/localization';

const CalendarMonthView = ({ opened, viewDate, doctorId, onDateClick }) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const [schedules, setSchedules] = useState([]);
  const [monthDays, setMonthDays] = useState([]);
  const currentDate = moment().format('DD');

  useEffect(() => {
    if (opened) {
      logUserAction(
        Action.ViewAppointments,
        JSON.stringify({ mode: 'Month', doctorId }),
      );
    }
    if (viewDate != null && doctorId != null && opened) {
      setMonthDays(getDays(viewDate));
      fetchSchedules();
    }
  }, [viewDate, doctorId, opened]);

  const fetchSchedules = async () => {
    const response = await dataAPI.fetchMonthSchedules(doctorId, viewDate);
    if (response.isError) {
      console.error(response.isError);
    } else {
      const newSchedules = [];
      for (let prop in response.data) {
        const date = moment(`${prop}`, 'YYYY-MM-DD').format('DD');
        newSchedules.push({ date, schedules: response.data[prop] });
      }
      console.log(newSchedules);
      setSchedules(newSchedules);
    }
  };

  useEffect(() => {
    setIsClosed(!opened);
  }, [opened]);

  if (isClosed) return null;

  const rowsCount = monthDays.length / 7;
  const calendarRect = document
    .getElementById('calendar-content')
    ?.getBoundingClientRect();

  const handleDayClick = day => {
    const date = moment(day.fullDate, 'YYYY-DD-MM').toDate();
    onDateClick(date);
  };

  const getSchedules = day => {
    return schedules.find(item => item.date === day.date)?.schedules || [];
  };

  const renderSchedule = schedule => {
    return (
      <div
        className='appointment-item'
        style={{
          border: `1px solid ${schedule.serviceColor}`,
          backgroundColor: `${schedule.serviceColor}1A`,
        }}
      >
        <span className='service-name' style={{ color: schedule.serviceColor }}>
          {schedule.serviceName}
        </span>
      </div>
    );
  };

  const renderDayItem = day => {
    const daySchedules = getSchedules(day);
    return (
      <div
        onClick={() => handleDayClick(day)}
        className={clsx(
          'item-data-container',
          currentDate === day.date && day.isCurrent && 'current-date',
        )}
        style={{ height: calendarRect?.height / rowsCount }}
        key={`${day.date}-${day.isCurrent}-${day.month}`}
      >
        <span
          className={clsx(
            'item-text month-day',
            !day.isCurrent && 'next-month',
          )}
        >
          {day.date}
        </span>
        {day.isCurrent && (
          <div className='appointments-container'>
            {daySchedules.slice(0, 3).map(renderSchedule)}
            {daySchedules.length > 3 && (
              <div className='view-more-container'>
                <span className='view-more-button'>
                  {textForKey('View more')} ({daySchedules.length - 3})
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return <div className='month-view'>{monthDays.map(renderDayItem)}</div>;
};

export default CalendarMonthView;

CalendarMonthView.propTypes = {
  opened: PropTypes.bool.isRequired,
  viewDate: PropTypes.instanceOf(Date),
  doctorId: PropTypes.string,
  onDateClick: PropTypes.func,
};

CalendarMonthView.defaultProps = {
  onDateClick: () => null,
};
