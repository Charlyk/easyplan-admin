import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { usePubNub } from 'pubnub-react';
import { useDispatch, useSelector } from 'react-redux';
import useSWR from 'swr';
import PageHeader from 'app/components/common/MainComponent/PageHeader/PageHeader';
import IconArrowDown from 'app/components/icons/iconArrowDown';
import { APP_DATA_API } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { handleRemoteMessage } from 'app/utils/pubnubUtils';
import redirectIfOnGeneralHost from 'app/utils/redirectIfOnGeneralHost';
import { environment, isDev } from 'eas.config';
import { signOut } from 'middleware/api/auth';
import { triggerUserLogout } from 'redux/actions/actions';
import { setClinic } from 'redux/actions/clinicActions';
import { userClinicAccessChangeSelector } from 'redux/selectors/clinicDataSelector';
import styles from './DoctorsMain.module.scss';

const ClinicSelector = dynamic(() =>
  import('app/components/common/ClinicSelector'),
);
const EditProfileModal = dynamic(() =>
  import('app/components/common/modals/EditProfileModal'),
);

const DoctorsMain = ({ children, pageTitle, authToken }) => {
  const { data } = useSWR(APP_DATA_API);
  const { currentUser, currentClinic } = data;
  const clinicAccessChange = useSelector(userClinicAccessChangeSelector);
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
    redirectIfOnGeneralHost(currentUser, router);
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

  useEffect(() => {
    handleUserAccessChange();
  }, [clinicAccessChange, currentUser, currentClinic]);

  const handleUserAccessChange = async () => {
    if (
      clinicAccessChange == null ||
      currentUser == null ||
      currentClinic == null ||
      clinicAccessChange.clinicId !== currentClinic.id ||
      clinicAccessChange.userId !== currentUser.id ||
      !clinicAccessChange.accessBlocked
    ) {
      return;
    }
    try {
      await signOut();
      await router.replace(router.asPath);
    } catch (error) {
      console.error(error);
    }
  };

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
    window.open(clinicUrl, '_blank');
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
    <div className={styles.doctorsMainRoot}>
      <Head>
        <title>
          {currentClinic?.clinicName || 'EasyPlan.pro'} - {pageTitle || ''}
        </title>
      </Head>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      <EditProfileModal
        open={isEditingProfile}
        currentClinic={currentClinic}
        authToken={authToken}
        currentUser={currentUser}
        onClose={handleCloseEditProfile}
      />
      <div className={styles.doctorPageHeaderRoot}>
        <PageHeader
          isDoctor
          showLogo
          user={currentUser}
          currentClinic={currentClinic}
          onEditProfile={handleEditProfileClick}
          onLogout={handleStartLogout}
          titleComponent={
            <ClickAwayListener onClickAway={handleCompanyClose}>
              <Box
                className={styles.companySelectorContainer}
                ref={buttonRef}
                onClick={handleCompanyOpen}
              >
                <span className={styles.clinicName}>
                  {selectedClinic?.clinicName || textForKey('Create clinic')}
                </span>
                <IconArrowDown fill='#34344E' />
                <ClinicSelector
                  open={isSelectorOpen}
                  anchorEl={buttonRef}
                  currentUser={currentUser}
                  onCreate={handleCreateClinic}
                  onClose={handleCompanyClose}
                  onChange={handleCompanyChange}
                />
              </Box>
            </ClickAwayListener>
          }
        />
      </div>
      <div className={styles.doctorDataContainer}>
        {React.cloneElement(children, {
          ...children.props,
          currentUser,
          currentClinic,
        })}
      </div>
    </div>
  );
};

export default DoctorsMain;
