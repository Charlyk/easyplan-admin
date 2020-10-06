import React, { useRef, useState } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import IconArrowDown from '../../assets/icons/iconArrowDown';
import ClinicSelector from '../../components/ClinicSelector';
import PageHeader from '../../components/PageHeader';
import {
  changeSelectedClinic,
  setCreateClinic,
  triggerUserLogout,
} from '../../redux/actions/actions';
import { userSelector } from '../../redux/selectors/rootSelector';
import { textForKey } from '../../utils/localization';
import authManager from '../../utils/settings/authManager';
import PatientDetails from '../DoctorPatientDetails';
import DoctorPatients from '../DoctorPatients';
import './styles.scss';

import { useDispatch, useSelector } from 'react-redux';
import { ClickAwayListener } from '@material-ui/core';

const DoctorsMain = () => {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const currentUser = useSelector(userSelector);
  const selectedClinic =
    currentUser?.clinics?.find(
      item => item.id === currentUser?.selectedClinic,
    ) || null;

  if (!authManager.isLoggedIn()) {
    return <Redirect to='/login' />;
  }

  const handleCompanyClose = () => {
    setIsSelectorOpen(false);
  };

  const handleCompanyOpen = () => {
    setIsSelectorOpen(true);
  };

  const handleCompanyChange = company => {
    dispatch(changeSelectedClinic(company.id));
  };

  const handleCreateClinic = () => {
    dispatch(setCreateClinic({ open: true, canClose: true }));
  };

  const handleStartLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  return (
    <div className='doctors-main-root'>
      <div className='doctor-page-header-root'>
        <PageHeader
          showLogo
          onLogout={handleStartLogout}
          titleComponent={
            <div
              role='button'
              tabIndex={0}
              className='company-selector-container'
              ref={buttonRef}
              onClick={handleCompanyOpen}
            >
              <ClickAwayListener onClickAway={handleCompanyClose}>
                <span className='clinic-name'>
                  {selectedClinic?.clinicName || textForKey('Create clinic')}
                </span>
              </ClickAwayListener>
              <IconArrowDown fill='#34344E' />
              <ClinicSelector
                open={isSelectorOpen}
                anchorEl={buttonRef}
                onCreate={handleCreateClinic}
                onClose={handleCompanyClose}
                onChange={handleCompanyChange}
              />
            </div>
          }
        />
      </div>
      <div className='doctor-data-container'>
        <Switch>
          <Route path='/' exact component={DoctorPatients} />
          <Route path='/:patientId' exact component={PatientDetails} />
        </Switch>
      </div>
    </div>
  );
};

export default DoctorsMain;
