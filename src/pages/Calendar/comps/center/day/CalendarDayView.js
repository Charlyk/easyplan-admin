import React, { useEffect } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring';

import DayAppointmentItem from './DayAppointmentItem';

function createHoursList() {
  return [].concat(
    ...Array.from(Array(24), (_, hour) => [moment({ hour }).format('HH:mm')]),
  );
}

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
  const currentHour = moment().format('HH:00');
  const hours = createHoursList();

  const [{ opacity }, set] = useSpring(() => ({
    opacity: 1,
  }));

  useEffect(() => {
    set({
      opacity: opened ? 1 : 0,
    });
  }, [opened]);

  return (
    <animated.div
      className='calendar-root__day-view'
      id='appointments-container'
      style={{
        opacity,
      }}
    >
      {hours.map(item => (
        <Hour hour={item} key={item} highlighted={item === currentHour} />
      ))}
      <DayAppointmentItem
        appointment={{ startHour: '10:00', endHour: '11:30' }}
      />
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
