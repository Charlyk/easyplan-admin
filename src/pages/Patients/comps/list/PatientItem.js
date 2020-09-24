import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

import IconAvatar from '../../../../assets/icons/iconAvatar';
import IconNext from '../../../../assets/icons/iconNext';

const PatientItem = ({ patient, selected, onSelected }) => {
  const patientName = () => {
    let fullName = `${patient?.firstName || ''} ${patient?.lastName || ''}`;
    if (fullName.replace(' ', '').length === 0) {
      fullName = patient.phoneNumber;
    }
    return fullName;
  };

  return (
    <div
      role='button'
      tabIndex={0}
      className={clsx('patients-root__list__item', selected && 'selected')}
      onClick={() => onSelected(patient)}
    >
      <div className='patients-root__list__item__patient-photo'>
        {patient.photo ? <Image roundedCircle /> : <IconAvatar />}
      </div>
      <div
        className={clsx(
          'patients-root__list__item__patient-name',
          selected && 'selected',
        )}
      >
        {patientName()}
      </div>
      {selected && <IconNext />}
    </div>
  );
};

export default PatientItem;

PatientItem.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onSelected: PropTypes.func,
};

PatientItem.defaultProps = {
  onSelected: () => null,
};
