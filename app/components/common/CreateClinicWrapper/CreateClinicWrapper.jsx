import React, { useReducer } from 'react';
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Typography } from "@material-ui/core";
import getClinicUrl from "../../../utils/getClinicUrl";
import { createNewClinic } from "../../../../middleware/api/clinic";
import { isDev } from "../../../../eas.config";
import CreateClinicForm from "../CreateClinicForm";
import reducer, {
  setIsLoading,
  initialState
} from './createClinicWrapperSlice';
import styles from './CreateClinic.module.scss';
import useIsMobileDevice from "../../../utils/hooks/useIsMobileDevice";
import urlToLambda from "../../../utils/urlToLambda";

export default function CreateClinicWrapper({ token, redirect, countries, shouldLogin, isMobile }) {
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
  }

  const handleCreateClinic = async (clinicData) => {
    dispatch(setIsLoading(true));
    try {
      const requestBody = { ...clinicData };
      delete requestBody.logoFile;
      const response = await createNewClinic(clinicData, clinicData.logoFile);
      if (shouldLogin) {
        await router.replace('/login')
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
  }

  return (
    <div className={styles.createClinicRoot}>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {!isMobileDevice && (
        <div className={styles.logoContainer}>
          <img
            src={urlToLambda('settings/easyplan-logo.svg')}
            alt='EasyPlan'
          />
        </div>
      )}
      <div
        className={styles.formContainer}
        style={{
          width: isMobileDevice ? '100%' : '60%',
          backgroundColor: isMobileDevice ? '#34344E' : '#E5E5E5',
        }}
      >
        {isMobileDevice && (
          <img
            src={urlToLambda('settings/easyplan-logo.svg')}
            alt='EasyPlan'
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
};
