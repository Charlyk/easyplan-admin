import React, { useReducer } from 'react';
import { useRouter } from "next/router";
import { Typography } from "@material-ui/core";
import { toast } from "react-toastify";

import RegisterForm from "../../../../app/components/common/RegistrationWrapper/RegisterForm/RegisterForm";
import { uploadFileToAWS } from "../../../../utils/helperFuncs";
import { registerUser } from "../../../../middleware/api/auth";
import { textForKey } from "../../../../utils/localization";
import { isDev } from "../../../../eas.config";
import reducer, {
  initialState,
  setIsLoading
} from './registrationWrapperSlice'
import styles from './RegistrationWrapper.module.scss';

export default function RegistrationWrapper() {
  const router = useRouter();
  const [{ errorMessage, isLoading }, dispatch] = useReducer(reducer, initialState);

  const handleOpenLogin = () => {
    router.back();
  };

  const handleCreateAccount = async (accountData) => {
    dispatch(setIsLoading(true));
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
      dispatch(setIsLoading(false));
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