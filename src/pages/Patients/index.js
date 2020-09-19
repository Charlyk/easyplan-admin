import React from 'react';

import PatientsList from './comps/list/PatientsList';
import './styles.scss';
import PatientAccount from './comps/PatientAccount';
import PatientDetails from './comps/details/PatientDetails';

const Patients = props => {
  return (
    <div className='patients-root'>
      <div className='patients-root__content'>
        <div className='patients-root__content__list'>
          <PatientsList />
        </div>
        <div className='patients-root__content__account'>
          <PatientAccount />
        </div>
        <div className='patients-root__content__details'>
          <PatientDetails />
        </div>
      </div>
    </div>
  );
};

export default Patients;
