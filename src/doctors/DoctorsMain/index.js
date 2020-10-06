import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import PageHeader from '../../components/PageHeader';
import DoctorPatients from '../DoctorPatients';
import PatientDetails from '../DoctorPatients/components/details/PatientDetails';
import './styles.scss';
import authManager from '../../utils/settings/authManager';

const DoctorsMain = props => {
  if (!authManager.isLoggedIn()) {
    return <Redirect to='/login' />;
  }

  return (
    <div className='doctors-main-root'>
      <div className='doctor-page-header-root'>
        <PageHeader showLogo />
      </div>
      <div className='doctor-data-container'>
        <Switch>
          <Route path='/' component={DoctorPatients} />
          <Route path='/:patientId' component={PatientDetails} />
        </Switch>
      </div>
    </div>
  );
};

export default DoctorsMain;
