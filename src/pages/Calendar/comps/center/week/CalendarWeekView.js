import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

import { getCurrentWeek } from '../../../../../utils/helperFuncs';
import CalendarWeekDayView from './CalendarWeekDayView';

const CalendarWeekView = ({ opened, hours, doctorId, viewDate }) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const [week, setWeek] = useState(getCurrentWeek(viewDate));
  const currentHour = moment().format('HH:00');

  useEffect(() => {
    setIsClosed(!opened);
  }, [opened]);

  useEffect(() => {
    setWeek(getCurrentWeek(viewDate));
  }, [viewDate]);

  if (isClosed) return null;

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
        {week.map(day => (
          <CalendarWeekDayView
            doctorId={doctorId}
            key={day}
            day={day}
            hours={hours}
          />
        ))}
      </div>
    </animated.div>
  );
};

export default CalendarWeekView;

CalendarWeekView.propTypes = {
  opened: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  doctorId: PropTypes.string,
  viewDate: PropTypes.instanceOf(Date),
};
