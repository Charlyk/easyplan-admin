import React, { useContext, useReducer } from 'react';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import NotificationsContext from 'app/context/notificationsContext';
import { HeaderKeys } from 'app/utils/constants';
import getClinicUrl from 'app/utils/getClinicUrl';
import useIsMobileDevice from 'app/utils/hooks/useIsMobileDevice';
import { isDev } from 'eas.config';
import { createNewClinic } from 'middleware/api/clinic';
import CreateClinicForm from '../CreateClinicForm';
import EASImage from '../EASImage';
import styles from './CreateClinic.module.scss';
import reducer, {
  setIsLoading,
  initialState,
} from './createClinicWrapperSlice';

export default function CreateClinicWrapper({
  token,
  redirect,
  countries,
  shouldLogin,
  isMobile,
}) {
  const toast = useContext(NotificationsContext);
  const router = useRouter();
  const isOnPhone = useIsMobileDevice();
  const isMobileDevice = isMobile || isOnPhone;
  const [{ isLoading }, dispatch] = useReducer(reducer, initialState);

  const handleGoBack = async () => {
    if (redirect) {
      await router.replace('/login');
    } else {
      router.back();
    }
  };

  const redirectToDashboard = async (clinic) => {
    const clinicUrl = getClinicUrl(clinic, token);
    await router.replace(clinicUrl);
  };

  const handleCreateClinic = async (clinicData) => {
    dispatch(setIsLoading(true));
    try {
      const requestBody = { ...clinicData };
      delete requestBody.logoFile;
      const response = await createNewClinic(clinicData, clinicData.logoFile);
      if (shouldLogin) {
        await router.replace('/login');
      } else if (redirect) {
        await redirectToDashboard(response.data);
      } else {
        router.back();
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        toast.error(data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className={styles.createClinicRoot}>
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
        <CreateClinicForm
          isMobile={isMobileDevice}
          countries={countries}
          redirect={redirect}
          onSubmit={handleCreateClinic}
          onGoBack={handleGoBack}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
