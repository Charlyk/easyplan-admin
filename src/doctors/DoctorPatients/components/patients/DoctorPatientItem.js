import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import IconAvatar from '../../../../assets/icons/iconAvatar';
import IconNext from '../../../../assets/icons/iconNext';
import { ScheduleStatuses } from '../../../../utils/constants';
import { textForKey } from '../../../../utils/localization';

const DoctorPatientItem = ({ schedule, patient, onView }) => {
  const appointmentStatus = ScheduleStatuses.find(
    item => item.id === schedule?.status,
  );

  return (
    <div
      className={clsx(
        'patient-item-root',
        appointmentStatus.id === 'OnSite' && 'on-site',
      )}
    >
      <div className='item-header'>
        <IconAvatar />
        <span className='patient-name'>{patient.fullName}</span>
      </div>
      {schedule ? (
        <div className='item-data'>
          <div className='row-wrapper'>
            <span className='row-title'>
              {textForKey('Appointment status')}:
            </span>
            <span className='row-value'>{appointmentStatus?.name}</span>
          </div>
          <div className='row-wrapper'>
            <span className='row-title'>{textForKey('Treatment type')}:</span>
            <span className='row-value'>{schedule?.serviceName}</span>
          </div>
          <div className='row-wrapper'>
            <span className='row-title'>{textForKey('Note')}:</span>
            <span className='row-value'>{schedule?.note}</span>
          </div>
          <div className='row-wrapper'>
            <span className='row-title'>{textForKey('Doctor')}:</span>
            <span className='row-value'>{schedule?.doctorName}</span>
          </div>
        </div>
      ) : (
        <div className='no-data-placeholder'>
          <span className='no-data-label'>{textForKey('No appointment')}</span>
        </div>
      )}
      <div
        role='button'
        tabIndex={0}
        className='details-button'
        onClick={() => onView({ schedule, patient })}
      >
        <span className='button-text'>{textForKey('View')}</span>
        <IconNext circleColor='transparent' />
      </div>
    </div>
  );
};

export default DoctorPatientItem;

DoctorPatientItem.propTypes = {
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
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }),
};

DoctorPatientItem.defaultProps = {
  onView: () => null,
};
