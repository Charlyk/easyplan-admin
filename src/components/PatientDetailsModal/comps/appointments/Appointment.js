import React from 'react';

import { Typography } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../assets/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../assets/icons/iconAppointmentClock';
import { Statuses } from '../../../../utils/constants';
import { textForKey } from '../../../../utils/localization';

const Appointment = ({ appointment }) => {
  const scheduleData = moment(appointment.startTime);
  const status = Statuses.find(item => item.id === appointment.scheduleStatus);
  return (
    <div className='patient-appointments-list__item'>
      <div className='appointment-info'>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>{textForKey('Doctor')}:</div>
          <div>{appointment.doctor.fullName}</div>
        </div>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>
            {textForKey('Services')}:
          </div>
          <div>{appointment.serviceName}</div>
        </div>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>{textForKey('Clinic')}:</div>
          <div>{appointment.clinic.name}</div>
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
      <div
        className='appointment-status-indicator'
        style={{ backgroundColor: `${status.color}1A` }}
      >
        <Typography
          classes={{ root: 'status-name-label' }}
          style={{ color: status.color }}
        >
          {status?.name}
        </Typography>
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
