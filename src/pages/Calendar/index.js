import React from 'react';

import './styles.scss';
import AppointmentsCalendar from './comps/center/AppointmentsCalendar';
import CalendarDoctors from './comps/left/CalendarDoctors';
import ServicesFilter from './comps/left/ServicesFilter';
import CalendarRightContainer from './comps/right/CalendarRightContainer';

const Calendar = props => {
  return (
    <div className='calendar-root'>
      <div className='calendar-root__content__left-container'>
        <ServicesFilter />
        <CalendarDoctors />
      </div>
      <div className='calendar-root__content__center-container'>
        <AppointmentsCalendar />
      </div>
      <div className='calendar-root__content__right-container'>
        <CalendarRightContainer />
      </div>
    </div>
  );
};

export default Calendar;
