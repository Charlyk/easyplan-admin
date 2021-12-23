import React, { useContext, useReducer } from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import AppLogoWhite from 'app/components/icons/AppLogoWhite';
import NotificationsContext from 'app/context/notificationsContext';
import useIsMobileDevice from 'app/hooks/useIsMobileDevice';
import { textForKey } from 'app/utils/localization';
import { isDev } from 'eas.config';
import { registerUser } from 'middleware/api/auth';
import { setAuthenticationData } from 'redux/slices/appDataSlice';
import styles from './RegistrationWrapper.module.scss';
import reducer, {
  initialState,
  setIsLoading,
} from './registrationWrapperSlice';

const RegisterForm = dynamic(() => import('./RegisterForm'));

export default function RegistrationWrapper({ isMobile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useContext(NotificationsContext);
  const isOnPhone = useIsMobileDevice();
  const isMobileDevice = isMobile || isOnPhone;
  const [{ errorMessage, isLoading }, localDispatch] = useReducer(
    reducer,
    initialState,
  );

  const handleOpenLogin = () => {
    router.push('/login');
  };

  const handleCreateAccount = async (accountData) => {
    localDispatch(setIsLoading(true));
    try {
      const requestBody = { ...accountData };
      delete requestBody.avatarFile;
      const response = await registerUser(accountData, accountData.avatarFile);
      dispatch(setAuthenticationData(response.data));
      await router.replace('/create-clinic?login=1');
    } catch (error) {
      if (error.response != null) {
        const { data } = error.response;
        toast.error(data.message);
      } else {
        toast.error(error.message);
      }
    } finally {
      localDispatch(setIsLoading(false));
    }
  };

  return (
    <div className={styles.registerFormRoot}>
      <Head>
        <title>EasyPlan.pro - {textForKey('Create new account')}</title>
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
