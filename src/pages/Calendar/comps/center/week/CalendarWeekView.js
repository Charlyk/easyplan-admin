import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

import { createHoursList } from '../../../../../utils/helperFuncs';
import CalendarWeekDayView from './CalendarWeekDayView';

const CalendarWeekView = ({ opened }) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const currentHour = moment().format('HH:00');
  const hours = createHoursList();

  useEffect(() => {
    setIsClosed(!opened);
  }, [opened]);

  if (isClosed) return null;

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        moment()
          .weekday(i)
          .format('DD ddd'),
      );
    }
    return days;
  };

  return (
    <animated.div className='week-view'>
      <div className='text-container'>
        {hours.map((hour, index) => (
          <div
            className={clsx(
              'week-hour-text',
              currentHour === hour && 'highlighted',
            )}
            key={`${hours}-${index}-text`}
          >
            {hour}
          </div>
        ))}
      </div>
      <div className='days-container'>
        {getWeekDays().map(day => (
          <CalendarWeekDayView key={day} day={day} />
        ))}
      </div>
    </animated.div>
  );
};

export default CalendarWeekView;

CalendarWeekView.propTypes = {
  opened: PropTypes.bool,
};
