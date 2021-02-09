import React, { useRef, useState } from 'react';

import { ClickAwayListener } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import IconArrowDown from '../../assets/icons/iconArrowDown';
import ClinicSelector from '../../components/ClinicSelector';
import EditProfileModal from '../../components/EditProfileModal';
import PageHeader from '../../components/PageHeader';
import {
  changeSelectedClinic,
  setCreateClinic,
  triggerUserLogout,
} from '../../redux/actions/actions';
import { userSelector } from '../../redux/selectors/rootSelector';
import { updateLink } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import authManager from '../../utils/settings/authManager';
import sessionManager from '../../utils/settings/sessionManager';
import DoctorPatientDetails from '../DoctorPatientDetails';
import DoctorPatients from '../DoctorPatients';
import './styles.scss';

const DoctorsMain = () => {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const currentUser = useSelector(userSelector);
  const selectedClinic = currentUser?.clinics?.find(
    (item) => item.clinicId === sessionManager.getSelectedClinicId(),
  );

  if (!authManager.isLoggedIn()) {
    return <Redirect to={updateLink('/login')} />;
  }

  const handleCompanyClose = () => {
    setIsSelectorOpen(false);
  };

  const handleCompanyOpen = () => {
    setIsSelectorOpen(true);
  };

  const handleCompanyChange = (company) => {
    dispatch(changeSelectedClinic(company.clinicId));
  };

  const handleCreateClinic = () => {
    dispatch(setCreateClinic({ open: true, canClose: true }));
  };

  const handleStartLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  const handleEditProfileClick = () => {
    setIsEditingProfile(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditingProfile(false);
  };

  return (
    <div className='doctors-main-root'>
      <EditProfileModal
        open={isEditingProfile}
        onClose={handleCloseEditProfile}
      />
      <div className='doctor-page-header-root'>
        <PageHeader
          isDoctor
          showLogo
          onEditProfile={handleEditProfileClick}
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
          <Route path='/:scheduleId' exact component={DoctorPatientDetails} />
        </Switch>
      </div>
    </div>
  );
};

export default DoctorsMain;
