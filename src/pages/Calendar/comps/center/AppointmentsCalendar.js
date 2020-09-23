import React, { useState } from 'react';

import EasyTab from '../../../../components/EasyTab';
import { textForKey } from '../../../../utils/localization';
import CalendarDayView from './day/CalendarDayView';
import CalendarMonthView from './month/CalendarMonthView';
import CalendarWeekView from './week/CalendarWeekView';

const CalendarView = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'ear',
};

const AppointmentsCalendar = props => {
  const [currentTab, setCurrentTab] = useState(CalendarView.month);

  const handleTabChange = newTab => {
    setCurrentTab(newTab);
  };

  return (
    <div className='calendar-root__center'>
      <div className='center-header'>
        <span className='center-header__date'>20 January 2020</span>
        <div className='center-header__tabs'>
          <EasyTab
            title={textForKey('Day')}
            selected={currentTab === CalendarView.day}
            onClick={() => handleTabChange(CalendarView.day)}
          />
          <EasyTab
            title={textForKey('Week')}
            selected={currentTab === CalendarView.week}
            onClick={() => handleTabChange(CalendarView.week)}
          />
          <EasyTab
            title={textForKey('Month')}
            selected={currentTab === CalendarView.month}
            onClick={() => handleTabChange(CalendarView.month)}
          />
          <EasyTab
            title={textForKey('Year')}
            selected={currentTab === CalendarView.year}
            onClick={() => handleTabChange(CalendarView.year)}
          />
        </div>
      </div>
      <div className='center-content'>
        <CalendarDayView opened={currentTab === CalendarView.day} />
        <CalendarWeekView opened={currentTab === CalendarView.week} />
        <CalendarMonthView opened={currentTab === CalendarView.month} />
      </div>
    </div>
  );
};

export default AppointmentsCalendar;
