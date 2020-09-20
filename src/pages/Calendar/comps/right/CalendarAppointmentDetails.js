import React from 'react';

import IconAppointmentCalendar from '../../../../assets/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../assets/icons/iconAppointmentClock';
import IconEditService from '../../../../assets/icons/iconEditService';
import IconEmail from '../../../../assets/icons/iconEmail';
import IconPhone from '../../../../assets/icons/iconPhone';
import { textForKey } from '../../../../utils/localization';

const CalendarAppointmentDetails = props => {
  return (
    <div className='appointment-details'>
      <div className='appointment-details-header'>
        <div className='service-name-container'>
          <div className='color-indicator' />
          <span className='service-name'>Service name</span>
        </div>
        <div role='button' tabIndex={0} className='edit-button'>
          <IconEditService />
        </div>
      </div>
      <div className='appointment-details-data'>
        <div className='doctor-info'>
          <div className='info-row'>
            <span className='info-row-title'>Doctor Name</span>
          </div>
          <div className='info-row'>
            <IconAppointmentCalendar />
            <span className='info-row-text'>20 Sep 2020</span>
          </div>
          <div className='info-row'>
            <IconAppointmentClock />
            <span className='info-row-text'>13:00</span>
          </div>
        </div>
        <div className='patient-info'>
          <div className='info-row'>
            <span className='info-row-title'>{textForKey('Patient')}:</span>
            <span className='info-row-text'>Patient Name</span>
          </div>
          <div className='info-row'>
            <IconPhone />
            <span className='info-row-text'>+37379466284</span>
          </div>
          <div className='info-row'>
            <IconEmail />
            <span className='info-row-text'>patient@email.com</span>
          </div>
          <div className='info-row'>
            <span className='info-row-title'>Notes</span>
          </div>
          <div className='info-row'>
            <span className='info-row-text'>
              Some long text will go here so we need to fill it with an example
              to see how it looks
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarAppointmentDetails;
