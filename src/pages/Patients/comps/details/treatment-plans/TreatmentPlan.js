import React from 'react';

import PropTypes from 'prop-types';

import IconAppointmentCalendar from '../../../../../assets/icons/iconAppointmentCalendar';
import IconAppointmentClock from '../../../../../assets/icons/iconAppointmentClock';
import IconNext from '../../../../../assets/icons/iconNext';
import { textForKey } from '../../../../../utils/localization';

const TreatmentPlan = ({ appointment }) => {
  return (
    <div className='patient-treatment-plans__item'>
      <div className='patient-treatment-plans__item__data-container'>
        <div className='plan-info'>
          <div className='plan-info-row'>
            <div className='plan-info-title'>{textForKey('Doctor')}:</div>
            <div>Some doctor</div>
          </div>
          <div className='plan-info-row'>
            <div className='plan-info-title'>{textForKey('Service')}:</div>
            <div>Some doctor</div>
          </div>
        </div>
        <div className='plan-time'>
          <div className='plan-time-row'>
            <IconAppointmentCalendar />
            <div className='plan-time-text'>Some Text</div>
          </div>
          <div className='plan-time-row'>
            <IconAppointmentClock />
            <div className='plan-time-text'>Some Text</div>
          </div>
        </div>
      </div>
      <div className='patient-treatment-plans__item__status-and-action'>
        <div className='plan-status-indicator not-paid'>
          <div className='dot-indicator' />
          Completed not paid
        </div>

        <div className='view-more-btn' role='button' tabIndex={0}>
          View more
          <IconNext />
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlan;

TreatmentPlan.propTypes = {
  appointment: PropTypes.object,
};
