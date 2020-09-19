import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';

import IconAvatar from '../../../../assets/icons/iconAvatar';
import IconNext from '../../../../assets/icons/iconNext';

const PatientItem = ({ patient, selected, onSelected }) => {
  return (
    <div
      role='button'
      tabIndex={0}
      className={clsx('patients-root__list__item', selected && 'selected')}
      onClick={() => onSelected(patient)}
    >
      <div className='patients-root__list__item__patient-photo'>
        {patient ? <Image roundedCircle /> : <IconAvatar />}
      </div>
      <div
        className={clsx(
          'patients-root__list__item__patient-name',
          selected && 'selected',
        )}
      >
        Patient Name
      </div>
      {selected && <IconNext />}
    </div>
  );
};

export default PatientItem;

PatientItem.propTypes = {
  patient: PropTypes.object,
  selected: PropTypes.bool,
  onSelected: PropTypes.func,
};

PatientItem.defaultProps = {
  onSelected: () => null,
};
