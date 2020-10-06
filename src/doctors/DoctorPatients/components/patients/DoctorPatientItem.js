import React from 'react';

import PropTypes from 'prop-types';

import IconAvatar from '../../../../assets/icons/iconAvatar';
import IconNext from '../../../../assets/icons/iconNext';
import { textForKey } from '../../../../utils/localization';

const DoctorPatientItem = ({ patient, onView }) => {
  const getPatientName = () => {
    if (patient.firstName && patient.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    } else if (patient.firstName) {
      return patient.firstName;
    } else if (patient.lastName) {
      return patient.lastName;
    } else {
      return patient.phoneNumber;
    }
  };

  return (
    <div className='patient-item-root'>
      <div className='item-header'>
        <IconAvatar />
        <span className='patient-name'>{getPatientName()}</span>
      </div>
      <div className='item-data'>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Treatment')}:</span>
          <span className='row-value'>Active</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Treatment type')}:</span>
          <span className='row-value'>Metal bracket</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Diagnostic')}:</span>
          <span className='row-value'>Free text</span>
        </div>
        <div className='row-wrapper'>
          <span className='row-title'>{textForKey('Doctor')}:</span>
          <span className='row-value'>Jacob Jones</span>
        </div>
      </div>
      <div
        role='button'
        tabIndex={0}
        className='details-button'
        onClick={() => onView(patient)}
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
};

DoctorPatientItem.defaultProps = {
  onView: () => null,
};
