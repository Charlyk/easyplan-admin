import React from 'react';

import PropTypes from 'prop-types';

import IconAvatar from '../../../../assets/icons/iconAvatar';
import IconNext from '../../../../assets/icons/iconNext';
import { ScheduleStatuses } from '../../../../utils/constants';
import { textForKey } from '../../../../utils/localization';

const DoctorPatientItem = ({ schedule, onView }) => {
  const appointmentStatus = ScheduleStatuses.find(
    item => item.id === schedule.status,
  );

  return (
    <div className='patient-item-root'>
      <div className='item-header'>
        <IconAvatar />
        <span className='patient-name'>{schedule.patientName}</span>
      </div>
      <div className='item-data'>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Appointment status')}:</span>
          <span className='row-value'>{appointmentStatus.name}</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Treatment type')}:</span>
          <span className='row-value'>{schedule.serviceName}</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Note')}:</span>
          <span className='row-value'>{schedule.note}</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Doctor')}:</span>
          <span className='row-value'>{schedule.doctorName}</span>
        </div>
      </div>
      <div
        role='button'
        tabIndex={0}
        className='details-button'
        onClick={() => onView(schedule)}
      >
        <span className='button-text'>{textForKey('View')}</span>
        <IconNext circleColor='transparent' />
      </div>
    </div>
  );
};

export default DoctorPatientItem;

DoctorPatientItem.propTypes = {
  patient: PropTypes.object,
  onView: PropTypes.func,
  schedule: PropTypes.shape({
    id: PropTypes.string,
    patientId: PropTypes.string,
    patientName: PropTypes.string,
    patientPhone: PropTypes.string,
    patientPhoto: PropTypes.string,
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

DoctorPatientItem.defaultProps = {
  onView: () => null,
};
