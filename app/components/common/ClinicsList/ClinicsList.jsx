import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import getClinicUrl from 'app/utils/getClinicUrl';
import useIsMobileDevice from 'app/utils/hooks/useIsMobileDevice';
import { textForKey } from 'app/utils/localization';
import { isDev } from 'eas.config';
import { signOut } from 'middleware/api/auth';
import { triggerUserLogout } from 'redux/actions/actions';
import EASImage from '../EASImage';
import ConfirmationModal from '../modals/ConfirmationModal';
import ClinicItem from './ClinicItem';
import styles from './ClnicsList.module.scss';

export default function ClinicsList({ user, authToken, isMobile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const isOnPhone = useIsMobileDevice();
  const isMobileDevice = isMobile || isOnPhone;
  const [showBlockedAccess, setShowBlockedAccess] = useState(false);

  useEffect(() => {
    if (user?.clinics.length === 1) {
      const userClinic = user.clinics[0];
      if (userClinic.accessBlocked) {
        handleAccessBlocked();
        return;
      }
      handleClinicSelected(user.clinics[0]);
    } else if (user?.clinics.length === 0) {
      router.replace('/create-clinic');
    }
  }, [user]);

  const handleAccessBlocked = async () => {
    setShowBlockedAccess(true);
    await signOut();
    await router.reload();
  };

  const handleClinicSelected = async (clinic) => {
    if (clinic.accessBlocked) {
      setShowBlockedAccess(true);
      return;
    }
    await signOut();
    const clinicUrl = getClinicUrl(clinic, authToken);
    await router.replace(clinicUrl);
  };

  const handleLogout = () => {
    dispatch(triggerUserLogout(true));
  };

  const handleCloseAccessBlocked = () => {
    setShowBlockedAccess(false);
  };

  return (
    <div className={styles.clinicsListRoot}>
      <ConfirmationModal
        show={showBlockedAccess}
        title={textForKey('access_blocked')}
        message={textForKey('access_blocked_message')}
        onClose={handleCloseAccessBlocked}
      />
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {!isMobileDevice && (
        <EASImage
          src='settings/easyplan-logo.svg'
          classes={{
            root: styles.logoContainer,
            image: styles.logoImage,
          }}
        />
      )}
      <div
        className={styles.formContainer}
        style={{
          width: isMobileDevice ? '100%' : '60%',
          backgroundColor: isMobileDevice ? '#34344E' : '#E5E5E5',
        }}
      >
        {isMobileDevice && (
          <EASImage
            src='settings/easyplan-logo.svg'
            className={styles.logoImage}
          />
        )}
        <div
          className={styles.clinicsWrapper}
          style={{
            padding: isMobileDevice ? '1rem' : '2rem',
            width: isMobileDevice ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
          }}
        >
          <Typography className={styles.formTitle}>
            {textForKey('Select a clinic')}
          </Typography>
          {user?.clinics?.map((clinic) => (
            <ClinicItem
              key={clinic.id}
              clinic={clinic}
              onSelected={handleClinicSelected}
            />
          ))}
          <Box display='flex' width='100%' alignItems='center' mt='1rem'>
            <Button className='positive-button' onPointerUp={handleLogout}>
              {textForKey('Logout')}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
}
