import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import { createHoursList } from '../../../../../utils/helperFuncs';
import CalendarWeekHourView from './CalendarWeekHourView';
import WeekAppointmentItem from './WeekAppointmentItem';

const CalendarWeekDayView = ({ day }) => {
  const currentHour = moment().format('HH:00');
  const hours = createHoursList();

  return (
    <div className='week-day'>
      <div id='days-container' className='day-title'>
        {day}
      </div>
      {hours.map(hour => (
        <CalendarWeekHourView
          key={`${hour}-${day}-key`}
          hour={hour}
          currentHour={hour === currentHour}
        />
      ))}
      <WeekAppointmentItem
        appointment={{
          startHour: '11:00',
          endHour: '12:30',
          serviceColor: '#F44081',
          serviceName: 'Extractie',
        }}
      />
    </div>
  );
};

export default CalendarWeekDayView;

CalendarWeekDayView.propTypes = {
  day: PropTypes.string,
};
