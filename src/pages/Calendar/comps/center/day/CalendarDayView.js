import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

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

const CalendarDayView = ({ opened, schedules, hours }) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const currentHour = moment().format('HH:00');

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
      {schedules.map(schedule => (
        <DayAppointmentItem key={schedule.id} schedule={schedule} />
      ))}
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
  hours: PropTypes.arrayOf(PropTypes.string),
  schedules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      patientId: PropTypes.string,
      patientName: PropTypes.string,
      patientPhone: PropTypes.string,
      doctorId: PropTypes.string,
      doctorName: PropTypes.string,
      serviceId: PropTypes.string,
      serviceName: PropTypes.string,
      serviceColor: PropTypes.string,
      serviceDuration: PropTypes.number,
      dateAndTime: PropTypes.string,
      status: PropTypes.string,
      note: PropTypes.string,
    }),
  ),
};
