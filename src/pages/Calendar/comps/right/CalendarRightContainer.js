import React from 'react';

import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import { getAppLanguage } from '../../../../utils/localization';
import CalendarAppointmentDetails from './CalendarAppointmentDetails';

const CalendarRightContainer = props => {
  return (
    <div className='calendar-root__appointment-info'>
      <Calendar locale={locales[getAppLanguage()]} date={new Date()} />
      <CalendarAppointmentDetails />
    </div>
  );
};

export default CalendarRightContainer;
