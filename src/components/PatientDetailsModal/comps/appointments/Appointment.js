import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../assets/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../assets/icons/iconAppointmentClock';
import { textForKey } from '../../../../utils/localization';

const Appointment = ({ appointment }) => {
  const scheduleData = moment(appointment.startTime);
  return (
    <div className='patient-appointments-list__item'>
      <div className='appointment-info'>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>{textForKey('Doctor')}:</div>
          <div>{appointment.doctor.fullName}</div>
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
    id: PropTypes.number,
    patient: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    doctor: PropTypes.shape({
      id: PropTypes.number,
      fullName: PropTypes.string,
    }),
    startTime: PropTypes.string,
    serviceName: PropTypes.string,
    serviceColor: PropTypes.string,
    dateAndTime: PropTypes.string,
    scheduleStatus: PropTypes.string,
  }),
};
