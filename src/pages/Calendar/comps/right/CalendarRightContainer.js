import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import IconPlus from '../../../../assets/icons/iconPlus';
import { getAppLanguage, textForKey } from '../../../../utils/localization';
import CalendarAppointmentDetails from './CalendarAppointmentDetails';

const CalendarRightContainer = ({ onAddAppointment, canAddAppointment }) => {
  return (
    <div className='calendar-root__appointment-info'>
      <Button
        className='positive-button'
        disabled={!canAddAppointment}
        onClick={onAddAppointment}
      >
        {textForKey('Add appointment')}
        <IconPlus />
      </Button>
      <Calendar locale={locales[getAppLanguage()]} date={new Date()} />
      <CalendarAppointmentDetails />
    </div>
  );
};

export default CalendarRightContainer;

CalendarRightContainer.propTypes = {
  canAddAppointment: PropTypes.bool,
  onAddAppointment: PropTypes.func,
};

CalendarRightContainer.defaultProps = {
  canAddAppointment: true,
  onAddAppointment: () => null,
};
