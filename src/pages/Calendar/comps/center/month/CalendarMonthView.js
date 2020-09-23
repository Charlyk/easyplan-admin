import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import { createMonthDays } from '../../../../../utils/helperFuncs';

const CalendarMonthView = ({ opened }) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const currentDate = moment().format('DD');
  const days = createMonthDays();

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
  return (
    <div className='month-view'>
      {getWeekDays().map(day => (
        <div key={day} className='item-data-container'>
          <span className='item-text'>{day}</span>
        </div>
      ))}
      {days.map(day => (
        <div
          className={clsx(
            'item-data-container',
            currentDate === day.date && day.isCurrent && 'current-date',
          )}
          key={`${day.date}-${day.isCurrent}`}
        >
          <span
            className={clsx(
              'item-text month-day',
              !day.isCurrent && 'next-month',
            )}
          >
            {day.date}
          </span>
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
        </div>
      ))}
    </div>
  );
};

export default CalendarMonthView;

CalendarMonthView.propTypes = {
  opened: PropTypes.bool.isRequired,
};
