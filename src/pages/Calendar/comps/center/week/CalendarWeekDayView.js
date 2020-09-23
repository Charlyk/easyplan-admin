import React from 'react';

import moment from 'moment';

import { createHoursList } from '../../../../../utils/helperFuncs';
import CalendarWeekHourView from './CalendarWeekHourView';

const CalendarWeekDayView = props => {
  const currentHour = moment().format('HH:00');
  const hours = createHoursList();

  return (
    <div className='week-day'>
      <div className='day-title'>02 Mon</div>
      {hours.map(hour => (
        <CalendarWeekHourView key={hour} currentHour={hour === currentHour} />
      ))}
    </div>
  );
};

export default CalendarWeekDayView;
