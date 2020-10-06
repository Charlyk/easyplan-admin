import React from 'react';

import PropTypes from 'prop-types';

import DoctorPatientItem from './DoctorPatientItem';

const PatientsList = ({ patients, onPatientSelect }) => {
  return (
    <div className='patients-list-root'>
      {patients.map(patient => (
        <DoctorPatientItem
          key={patient.id}
          patient={patient}
          onView={onPatientSelect}
        />
      ))}
    </div>
  );
};

export default PatientsList;

PatientsList.propTypes = {
  patients: PropTypes.array,
  onPatientSelect: PropTypes.func,
};

PatientsList.defaultProps = {
  onPatientSelect: () => null,
};
