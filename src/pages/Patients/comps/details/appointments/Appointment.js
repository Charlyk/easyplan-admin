import React from 'react';

import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../../assets/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../../assets/icons/iconAppointmentClock';
import { textForKey } from '../../../../../utils/localization';

const Appointment = ({ appointment }) => {
  return (
    <div className='patients-root__appointments__item'>
      <div className='appointment-info'>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>{textForKey('Doctor')}:</div>
          <div>Some doctor</div>
        </div>
        <div className='appointment-info-row'>
          <div className='appointment-info-title'>{textForKey('Service')}:</div>
          <div>Some doctor</div>
        </div>
      </div>
      <div className='appointment-time'>
        <div className='appointment-time-row'>
          <IconAppointmentCalendar />
          <div className='appointment-time-text'>Some Text</div>
        </div>
        <div className='appointment-time-row'>
          <IconAppointmentClock />
          <div className='appointment-time-text'>Some Text</div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;

Appointment.propTypes = {
  appointment: PropTypes.object,
};
