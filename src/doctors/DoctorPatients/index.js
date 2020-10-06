import React from 'react';

import './styles.scss';
import PatientsFilter from './components/patients/PatientsFilter';
import PatientsList from './components/patients/PatientsList';

const DoctorPatients = props => {
  return (
    <div className='doctor-patients-root'>
      <div className='filter-wrapper'>
        <PatientsFilter />
      </div>
      <div className='data-wrapper'>
        <PatientsList />
      </div>
    </div>
  );
};

export default DoctorPatients;
