import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

import { createHoursList } from '../../../../../utils/helperFuncs';
import DayAppointmentItem from './DayAppointmentItem';

const Hour = props => {
  return (
    <div
      id={props.hour}
      className={clsx('day-hour', props.highlighted && 'highlighted')}
    >
      <span className='hour-text'>{props.hour}</span>
      <div className='hour-line' />
    </div>
  );
};

const CalendarDayView = ({ opened }) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const currentHour = moment().format('HH:00');
  const hours = createHoursList();

  useEffect(() => {
    setIsClosed(!opened);
  }, [opened]);

  if (isClosed) return null;

  return (
    <animated.div
      className='calendar-root__day-view'
      id='appointments-container'
    >
      {hours.map(item => (
        <Hour hour={item} key={item} highlighted={item === currentHour} />
      ))}
      {hours?.length > 0 && (
        <DayAppointmentItem
          appointment={{ startHour: '11:00', endHour: '12:30' }}
        />
      )}
    </animated.div>
  );
};

export default CalendarDayView;

Hour.propTypes = {
  hour: PropTypes.string.isRequired,
  highlighted: PropTypes.bool,
};

CalendarDayView.propTypes = {
  opened: PropTypes.bool,
};
