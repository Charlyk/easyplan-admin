import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

const CalendarMonthView = ({ opened }) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const currentDate = moment().format('DD');

  const firstDayOfMonth = () => {
    return moment()
      .startOf('month')
      .format('d');
  };

  const lastDayOfMonth = () => {
    return moment()
      .endOf('month')
      .format('d');
  };

  const getDays = () => {
    const days = [];
    const daysInCurrentMonth = moment().daysInMonth();
    const currentMonthIndex = moment().month();

    const previousMonth = moment().add(-1, 'months');
    const daysInPreviousMonth = previousMonth.daysInMonth();

    for (let i = 0; i < firstDayOfMonth(); i++) {
      const date = moment({
        month: currentMonthIndex - 1,
        day: daysInPreviousMonth - i,
      }).format('DD');
      days.unshift({ date, month: currentMonthIndex - 1, isCurrent: false });
    }

    for (let i = 1; i < daysInCurrentMonth + 1; i++) {
      days.push({
        date: moment({ day: i }).format('DD'),
        month: currentMonthIndex,
        isCurrent: true,
      });
    }

    const lastDays = [];
    for (let i = lastDayOfMonth(); i > 0; i--) {
      lastDays.unshift({
        date: moment({ month: currentMonthIndex + 1, day: i }).format('DD'),
        month: currentMonthIndex + 1,
        isCurrent: false,
      });
    }
    return [...days, ...lastDays];
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        moment()
          .weekday(i)
          .format('ddd'),
      );
    }
    return days;
  };

  useEffect(() => {
    setIsClosed(!opened);
  }, [opened]);

  if (isClosed) return null;

  const renderDayItem = day => {
    return (
      <div
        className={clsx(
          'item-data-container',
          currentDate === day.date && day.isCurrent && 'current-date',
        )}
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
            <div className='appointment-item'>
              <span className='service-name'>Service name</span>
            </div>
            <div className='appointment-item'>
              <span className='service-name'>Service name</span>
            </div>
            <div className='appointment-item'>
              <span className='service-name'>Service name</span>
            </div>
            <div className='view-more-container'>
              <span className='view-more-button'>View more (7)</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='month-view'>
      {getWeekDays().map(day => (
        <div key={day} className='item-data-container'>
          <span className='item-text'>{day}</span>
        </div>
      ))}
      {getDays().map(day => renderDayItem(day))}
    </div>
  );
};

export default CalendarMonthView;

CalendarMonthView.propTypes = {
  opened: PropTypes.bool.isRequired,
};
