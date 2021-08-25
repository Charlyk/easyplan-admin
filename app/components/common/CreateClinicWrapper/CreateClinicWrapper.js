import React, { useReducer } from 'react';
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Typography } from "@material-ui/core";

import { getClinicUrl, uploadFileToAWS } from "../../../../utils/helperFuncs";
import { createNewClinic } from "../../../../middleware/api/clinic";
import { isDev } from "../../../../eas.config";
import CreateClinicForm from "../CreateClinicForm";
import reducer, {
  setIsLoading,
  initialState
} from './createClinicWrapperSlice';
import styles from './CreateClinic.module.scss';

export default function CreateClinicWrapper({ token, redirect, countries }) {
  const router = useRouter();
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
      if (clinicData.logoFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', clinicData.logoFile);
        clinicData.logo = uploadResult?.location;
        delete clinicData.logoFile;
      }
      const response = await createNewClinic(clinicData);
      if (redirect) {
        await redirectToDashboard(response.data);
      } else {
        router.back();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  return (
    <div className={styles.createClinicRoot}>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      <div className={styles.logoContainer}>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className={styles.formContainer}>
        <CreateClinicForm
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
