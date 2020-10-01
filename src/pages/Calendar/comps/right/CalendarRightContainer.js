import React from 'react';

import { Button } from 'react-bootstrap';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import IconPlus from '../../../../assets/icons/iconPlus';
import { getAppLanguage, textForKey } from '../../../../utils/localization';
import CalendarAppointmentDetails from './CalendarAppointmentDetails';

const CalendarRightContainer = props => {
  return (
    <div className='calendar-root__appointment-info'>
      <Button className='positive-button'>
        {textForKey('Add appointment')}
        <IconPlus />
      </Button>
      <Calendar locale={locales[getAppLanguage()]} date={new Date()} />
      <CalendarAppointmentDetails />
    </div>
  );
};

export default CalendarRightContainer;
