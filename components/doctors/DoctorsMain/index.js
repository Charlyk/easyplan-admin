import React, { useEffect, useRef, useState } from 'react';

import { ClickAwayListener, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import IconArrowDown from '../../icons/iconArrowDown';
import ClinicSelector from '../../common/ClinicSelector';
import EditProfileModal from '../../common/EditProfileModal';
import PageHeader from '../../common/PageHeader';
import { triggerUserLogout } from '../../../redux/actions/actions';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/DoctorsMain.module.scss';
import { environment, isDev } from "../../../eas.config";
import { useRouter } from "next/router";
import { setClinic } from "../../../redux/actions/clinicActions";
import { usePubNub } from "pubnub-react";
import { handleRemoteMessage } from "../../../utils/pubnubUtils";
import { redirectIfOnGeneralHost } from "../../../utils/helperFuncs";
import Head from "next/head";

const DoctorsMain = ({ children, currentUser, currentClinic, pageTitle }) => {
  const dispatch = useDispatch();
  const pubnub = usePubNub();
  const router = useRouter();
  const buttonRef = useRef(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const selectedClinic = currentUser?.clinics?.find(
    (item) => item.clinicId === currentClinic.id,
  );

  useEffect(() => {
    redirectIfOnGeneralHost(currentUser, router)
    if (currentUser != null) {
      pubnub.setUUID(currentUser.id);
    }

    if (currentClinic != null) {
      const { id } = currentClinic;
      dispatch(setClinic(currentClinic));
      pubnub.subscribe({
        channels: [`${id}-${environment}-clinic-pubnub-channel`],
      });
      pubnub.addListener({ message: handlePubnubMessageReceived });
      return () => {
        pubnub.unsubscribe({
          channels: [`${id}-${environment}-clinic-pubnub-channel`],
        });
      };
    }
  }, [currentUser, currentClinic]);

  const handlePubnubMessageReceived = ({ message }) => {
    dispatch(handleRemoteMessage(message));
  };

  const handleCompanyClose = () => {
    setIsSelectorOpen(false);
  };

  const handleCompanyOpen = () => {
    setIsSelectorOpen(true);
  };

  const handleCompanyChange = async (company) => {
    const [_, domain, location] = window.location.host.split('.');
    const { protocol } = window.location;
    const clinicUrl = `${protocol}//${company.clinicDomain}.${domain}.${location}`;
    window.open(clinicUrl, '_blank')
    handleCompanyClose();
  };

  const handleCreateClinic = async () => {
    await router.push('/create-clinic?redirect=0');
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
      <Head>
        <title>
          {currentClinic?.clinicName || 'EasyPlan.pro'} - {pageTitle || ''}
        </title>
      </Head>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
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
              <IconArrowDown fill='#34344E'/>
              <ClinicSelector
                open={isSelectorOpen}
                anchorEl={buttonRef}
                currentUser={currentUser}
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
