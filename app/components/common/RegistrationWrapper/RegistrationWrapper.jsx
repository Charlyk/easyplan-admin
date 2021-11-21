import React, { useReducer } from 'react';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import useIsMobileDevice from 'app/utils/hooks/useIsMobileDevice';
import { textForKey } from 'app/utils/localization';
import { isDev } from 'eas.config';
import { registerUser } from 'middleware/api/auth';
import EASImage from '../EASImage';
import styles from './RegistrationWrapper.module.scss';
import reducer, {
  initialState,
  setIsLoading,
} from './registrationWrapperSlice';

const RegisterForm = dynamic(() => import('./RegisterForm'));

export default function RegistrationWrapper({ isMobile }) {
  const router = useRouter();
  const isOnPhone = useIsMobileDevice();
  const isMobileDevice = isMobile || isOnPhone;
  const [{ errorMessage, isLoading }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const handleOpenLogin = () => {
    router.back();
  };

  const handleCreateAccount = async (accountData) => {
    dispatch(setIsLoading(true));
    try {
      const requestBody = { ...accountData };
      delete requestBody.avatarFile;
      await registerUser(accountData, accountData.avatarFile);
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
  };

  return (
    <div className={styles.registerFormRoot}>
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
}
