import React from 'react';

import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import IconPlus from '../../../../assets/icons/iconPlus';
import { getAppLanguage, textForKey } from '../../../../utils/localization';
import CalendarAppointmentDetails from './CalendarAppointmentDetails';

const CalendarRightContainer = ({
  onAddAppointment,
  selectedDate,
  canAddAppointment,
  selectedSchedule,
  onDateChange,
  onEditSchedule,
}) => {
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
      <Calendar
        locale={locales[getAppLanguage()]}
        onChange={onDateChange}
        date={selectedDate}
      />
      <CalendarAppointmentDetails
        onEdit={onEditSchedule}
        schedule={selectedSchedule}
      />
    </div>
  );
};

export default CalendarRightContainer;

CalendarRightContainer.propTypes = {
  canAddAppointment: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  onEditSchedule: PropTypes.func,
  selectedSchedule: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    doctorId: PropTypes.string,
    doctorName: PropTypes.string,
    serviceId: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    serviceDuration: PropTypes.string,
    dateAndTime: PropTypes.string,
    status: PropTypes.string,
    note: PropTypes.string,
  }),
  onAddAppointment: PropTypes.func,
  onDateChange: PropTypes.func,
};

CalendarRightContainer.defaultProps = {
  selectedDate: new Date(),
  canAddAppointment: true,
  onAddAppointment: () => null,
  onDateChange: () => null,
  onEditSchedule: () => null,
};
