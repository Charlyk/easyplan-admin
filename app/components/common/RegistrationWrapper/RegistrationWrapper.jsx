import React, { useReducer } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import Typography from "@material-ui/core/Typography";
import { toast } from "react-toastify";

import uploadFileToAWS from "../../../utils/uploadFileToAWS";
import { registerUser } from "../../../../middleware/api/auth";
import { textForKey } from "../../../utils/localization";
import useIsMobileDevice from "../../../utils/hooks/useIsMobileDevice";
import { isDev } from "../../../../eas.config";
import reducer, {
  initialState,
  setIsLoading
} from './registrationWrapperSlice'
import styles from './RegistrationWrapper.module.scss';

const RegisterForm = dynamic(() => import('./RegisterForm'));

export default function RegistrationWrapper() {
  const router = useRouter();
  const isMobileDevice = useIsMobileDevice();
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
      await router.replace('/create-clinic?login=1');
    } catch (error) {
      if (error.response != null) {
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
    <div className={styles.registerFormRoot}>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {!isMobileDevice && (
        <div className={styles.logoContainer}>
          <img
            src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
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
            src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
            alt='EasyPlan'
          />
        )}
        <RegisterForm
          isMobile={isMobileDevice}
          onSubmit={handleCreateAccount}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onGoBack={handleOpenLogin}
        />
      </div>
    </div>
  );
};