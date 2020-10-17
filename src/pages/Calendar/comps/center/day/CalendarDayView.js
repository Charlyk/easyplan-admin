import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';
import { animated } from 'react-spring';

import { Action } from '../../../../../utils/constants';
import { logUserAction } from '../../../../../utils/helperFuncs';
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

const CalendarDayView = ({
  opened,
  schedules,
  hours,
  doctorId,
  onScheduleSelect,
}) => {
  const [isClosed, setIsClosed] = useState(!opened);
  const currentHour = moment().format('HH:00');

  useEffect(() => {
    setIsClosed(!opened);
    if (opened) {
      logUserAction(
        Action.ViewAppointments,
        JSON.stringify({ mode: 'Day', doctorId }),
      );
    }
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
        <DayAppointmentItem
          key={schedule.id}
          onSelect={onScheduleSelect}
          schedule={schedule}
        />
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
  doctorId: PropTypes.string,
  opened: PropTypes.bool,
  hours: PropTypes.arrayOf(PropTypes.string),
  onScheduleSelect: PropTypes.func,
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

CalendarDayView.defaultProps = {
  onScheduleSelect: () => null,
};
