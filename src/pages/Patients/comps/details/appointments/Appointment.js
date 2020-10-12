import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../../assets/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../../assets/icons/iconAppointmentClock';
import { textForKey } from '../../../../../utils/localization';

const Appointment = ({ appointment }) => {
  const scheduleData = moment(appointment.dateAndTime);
  return (
    <div className='patient-appointments__item'>
      <div className='appointment-info'>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>{textForKey('Doctor')}:</div>
          <div>{appointment.doctorName}</div>
        </div>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>{textForKey('Service')}:</div>
          <div>{appointment.serviceName}</div>
        </div>
      </div>
      <div className='appointment-time'>
        <div className='appointment-time-row'>
          <IconAppointmentCalendar />
          <div className='appointment-time-text'>
            {scheduleData.format('DD MMM YYYY')}
          </div>
        </div>
        <div className='appointment-time-row'>
          <IconAppointmentClock />
          <div className='appointment-time-text'>
            {scheduleData.format('HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;

Appointment.propTypes = {
  appointment: PropTypes.shape({
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
};
