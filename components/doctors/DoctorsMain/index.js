import React, { useRef, useState } from 'react';

import { ClickAwayListener } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import IconArrowDown from '../../icons/iconArrowDown';
import ClinicSelector from '../../../src/components/ClinicSelector';
import EditProfileModal from '../../common/EditProfileModal';
import PageHeader from '../../common/PageHeader';
import {
  changeSelectedClinic,
  setCreateClinic,
  triggerUserLogout,
} from '../../../redux/actions/actions';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/DoctorsMain.module.scss';

const DoctorsMain = ({ children, currentUser, currentClinic }) => {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const selectedClinic = currentUser?.clinics?.find(
    (item) => item.clinicId === currentClinic.id,
  );

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
    <div className={styles['doctors-main-root']}>
      <EditProfileModal
        open={isEditingProfile}
        currentUser={currentUser}
        onClose={handleCloseEditProfile}
      />
      <div className={styles['doctor-page-header-root']}>
        <PageHeader
          isDoctor
          showLogo
          user={currentUser}
          currentClinic={currentClinic}
          onEditProfile={handleEditProfileClick}
          onLogout={handleStartLogout}
          titleComponent={
            <div
              role='button'
              tabIndex={0}
              className={styles['company-selector-container']}
              ref={buttonRef}
              onClick={handleCompanyOpen}
            >
              <ClickAwayListener onClickAway={handleCompanyClose}>
                <span className={styles['clinic-name']}>
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
      <div className={styles['doctor-data-container']}>
        {children}
      </div>
    </div>
  );
};

export default DoctorsMain;
