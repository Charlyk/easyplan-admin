import React from 'react';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

import AppointmentsContainer from './AppointemntsContainer';

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

const CalendarDayView = props => {
  const currentHour = moment().format('HH:00');
  const hours = createHoursList();
  return (
    <div className='calendar-root__day-view'>
      <div id='appointments-container' className='items-container'>
        <AppointmentsContainer fromHour='13:00' toHour='14:00' />
      </div>
      {hours.map(item => (
        <Hour hour={item} key={item} highlighted={item === currentHour} />
      ))}
    </div>
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
