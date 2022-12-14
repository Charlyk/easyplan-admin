import React, { useContext, useReducer } from 'react';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslate } from 'react-polyglot';
import AppLogoWhite from 'app/components/icons/AppLogoWhite';
import NotificationsContext from 'app/context/notificationsContext';
import useIsMobileDevice from 'app/hooks/useIsMobileDevice';
import getClinicUrl from 'app/utils/getClinicUrl';
import { isDev, loginUrl } from 'eas.config';
import { createNewClinic } from 'middleware/api/clinic';
import { setCurrentClinic } from 'redux/slices/appDataSlice';
import CreateClinicForm from '../CreateClinicForm';
import styles from './CreateClinic.module.scss';
import reducer, {
  setIsLoading,
  initialState,
} from './createClinicWrapperSlice';

export default function CreateClinicWrapper({
  newAccount,
  token,
  countries,
  isMobile,
}) {
  const textForKey = useTranslate();
  const toast = useContext(NotificationsContext);
  const router = useRouter();
  const isOnPhone = useIsMobileDevice();
  const isMobileDevice = isMobile || isOnPhone;
  const [{ isLoading }, dispatch] = useReducer(reducer, initialState);

  const handleGoBack = async () => {
    if (newAccount) {
      await router.replace(loginUrl);
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
      dispatch(setCurrentClinic(response.data));
      if (newAccount) {
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
      <Head>
        <title>EasyPlan.pro - {textForKey('create clinic')}</title>
      </Head>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {!isMobileDevice && (
        <Box className={styles.logoContainer}>
          <AppLogoWhite className={styles.logoImage} />
        </Box>
      )}
      <div
        className={styles.formContainer}
        style={{
          width: isMobileDevice ? '100%' : '60%',
          backgroundColor: isMobileDevice ? '#34344E' : '#E5E5E5',
        }}
      >
        {isMobileDevice && <AppLogoWhite className={styles.logoImage} />}
        <CreateClinicForm
          isMobile={isMobileDevice}
          countries={countries}
          redirect={newAccount}
          onSubmit={handleCreateClinic}
          onGoBack={handleGoBack}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
