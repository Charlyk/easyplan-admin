import React from 'react';

import PropTypes from 'prop-types';

import IconMoreHorizontal from '../../../../assets/icons/iconMoreHorizontal';
import IconPlus from '../../../../assets/icons/iconPlus';
import { textForKey } from '../../../../utils/localization';
import PatientItem from './PatientItem';

const PatientsList = ({ onAdd, onSelect, patients, selectedPatient }) => {
  return (
    <div className='patients-root__list'>
      <div className='patients-root__list__header'>
        {textForKey('All patients')}
        <div className='more-btn'>
          <IconMoreHorizontal />
        </div>
      </div>
      <div className='patients-root__list__content'>
        {patients.map(patient => (
          <PatientItem
            onSelected={onSelect}
            key={patient.id}
            selected={patient.id === selectedPatient?.id}
            patient={patient}
          />
        ))}
      </div>
      <div
        role='button'
        tabIndex={0}
        className='patients-root__list__add-btn'
        onClick={onAdd}
      >
        <IconPlus />
        {textForKey('Add patient')}
      </div>
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  selectedPatient: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    photo: PropTypes.string,
  }),
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      phoneNumber: PropTypes.string,
      photo: PropTypes.string,
    }),
  ),
  onSelect: PropTypes.func,
  onAdd: PropTypes.func,
};

PatientsList.defaultProps = {
  onAdd: () => null,
  onSelect: () => null,
};
