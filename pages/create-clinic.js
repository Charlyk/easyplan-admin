import React, { useReducer } from 'react';

import { useRouter } from "next/router";
import { generateReducerActions, getClinicUrl, uploadFileToAWS } from "../utils/helperFuncs";
import { toast } from "react-toastify";
import CreateClinicForm from "../components/login/registration/CreateClinicForm";
import { createNewClinic } from "../middleware/api/clinic";
import styles from '../styles/auth/CreateClinic.module.scss';
import { parseCookies } from "../utils";
import { isDev } from "../eas.config";
import { Typography } from "@material-ui/core";

const initialState = {
  isLoading: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
}

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export default function CreateClinic({ token, redirect }) {
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
    dispatch(actions.setIsLoading(true));
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
      dispatch(actions.setIsLoading(false));
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
          redirect={redirect}
          onSubmit={handleCreateClinic}
          onGoBack={handleGoBack}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ req, query }) => {
  const { auth_token } = parseCookies(req);
  const { redirect } = query;
  return {
    props: {
      token: auth_token,
      redirect: redirect === '1',
    },
  }
};
