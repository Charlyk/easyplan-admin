import React, { useEffect, useRef, useState } from 'react';

import { ClickAwayListener } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import IconArrowDown from '../../icons/iconArrowDown';
import ClinicSelector from '../../common/ClinicSelector';
import EditProfileModal from '../../common/EditProfileModal';
import PageHeader from '../../common/PageHeader';
import {
  setCreateClinic,
  triggerUserLogout,
} from '../../../redux/actions/actions';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/DoctorsMain.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";
import { Role } from "../../../utils/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setClinic } from "../../../redux/actions/clinicActions";
import { usePubNub } from "pubnub-react";
import { handleRemoteMessage } from "../../../utils/pubnubUtils";

const DoctorsMain = ({ children, currentUser, currentClinic }) => {
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
    if (currentUser != null) {
      pubnub.setUUID(currentUser.id);
    }

    if (currentClinic != null) {
      dispatch(setClinic(currentClinic));
      pubnub.subscribe({
        channels: [`${currentClinic.id}-clinic-pubnub-channel`],
      });
      pubnub.addListener({ message: handlePubnubMessageReceived });
      return () => {
        pubnub.unsubscribe({
          channels: [`${currentClinic.id}-clinic-pubnub-channel`],
        });
      };
    }
  }, []);

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
    try {
      const query = { clinicId: company.clinicId };
      const queryString = new URLSearchParams(query).toString()
      const { data: selectedClinic } =
        await axios.get(`${baseAppUrl}/api/clinic/change?${queryString}`);
      switch (selectedClinic.roleInClinic) {
        case Role.reception:
          const isPathRestricted = ['/analytics', '/services', '/users', '/messages']
            .some(item => router.asPath.startsWith(item));
          if (isPathRestricted) {
            await router.replace('/calendar/day');
          } else {
            await router.reload();
          }
          break;
        case Role.doctor:
          await router.replace('/doctor');
          break;
        default:
          await router.reload();
          break;
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message);
    }
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
