import React, { useReducer } from 'react';

import { useRouter } from "next/router";
import RegisterForm from "../components/login/registration/RegisterForm";
import { generateReducerActions, uploadFileToAWS } from "../utils/helperFuncs";
import { registerUser } from "../middleware/api/auth";
import { toast } from "react-toastify";
import { textForKey } from "../utils/localization";
import styles from '../styles/auth/Register.module.scss';
import { isDev } from "../eas.config";
import { Typography } from "@material-ui/core";

const initialState = {
  errorMessage: null,
  isLoading: false,
};

const reducerTypes = {
  setErrorMessage: 'setErrorMessage',
  setIsLoading: 'setIsLoading',
}

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setErrorMessage:
      return { ...state, errorMessage: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export default function Register() {
  const router = useRouter();
  const [{ errorMessage, isLoading }, dispatch] = useReducer(reducer, initialState);

  const handleOpenLogin = () => {
    router.back();
  };

  const handleCreateAccount = async (accountData) => {
    dispatch(actions.setIsLoading(true));
    try {
      if (accountData.avatarFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', accountData.avatarFile);
        accountData.avatar = uploadResult?.location;
        delete accountData.avatarFile;
      }
      await registerUser(accountData);
      toast.success(textForKey('account_created_success'));
      await router.replace('/create-clinic');
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(actions.setIsLoading(false));
    }
  }

  return (
    <div className={styles.registerFormRoot}>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      <div className={styles.logoContainer}>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className={styles.formContainer}>
        <RegisterForm
          onSubmit={handleCreateAccount}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onGoBack={handleOpenLogin}
        />
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {}
  }
}
