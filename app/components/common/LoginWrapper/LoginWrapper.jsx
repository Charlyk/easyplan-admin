import React, { useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import Typography from "@material-ui/core/Typography";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";

import getRedirectUrlForUser from "../../../utils/getRedirectUrlForUser";
import getClinicUrl from '../../../utils/getClinicUrl'
import { textForKey } from "../../../utils/localization";
import { loginUser, resetUserPassword, signOut } from "../../../../middleware/api/auth";
import { appBaseUrl, isDev } from "../../../../eas.config";
import { RestrictedSubdomains } from "../../../utils/constants";
import useIsMobileDevice from "../../../utils/hooks/useIsMobileDevice";
import reducer, {
  initialState,
  setCurrentForm,
  setErrorMessage,
  setIsLoading,
  FormType
} from './loginWrapperSlice'
import styles from './LoginWrapper.module.scss';

const ResetPassword = dynamic(() => import('./ResetPassword'));
const LoginForm = dynamic(() => import('./LoginForm'));

export default function LoginWrapper({ currentUser, currentClinic, authToken }) {
  const router = useRouter();
  const isMobileDevice = useIsMobileDevice();
  const [{
    currentForm,
    isLoading,
    errorMessage
  }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (currentUser != null && authToken) {
      handleUserAuthenticated(currentUser, authToken);
    } else if (currentClinic != null && authToken) {
      handleClinicExists(currentClinic, authToken);
    }
  }, [currentUser, currentClinic, authToken]);

  const handleClinicExists = async (clinic, token) => {
    const { host } = window.location;
    const [subdomain] = host.split('.');
    if (RestrictedSubdomains.includes(subdomain)) {
      await signOut();
      const clinicUrl = getClinicUrl(clinic, token);
      await router.replace(clinicUrl);
    } else {
      await router.replace('/analytics/general');
    }
  }

  const handleFormChange = (newForm) => {
    localDispatch(setCurrentForm(newForm));
  }

  const handleOpenLogin = () => {
    handleFormChange(FormType.login)
  };

  const handleGoToResetPassword = () => {
    handleFormChange(FormType.resetPassword);
  };

  const handleGoToSignUp = async () => {
    window.location = `${appBaseUrl}/register`;
  };

  const handleSuccessResponse = async (user, subdomain) => {
    const redirectUrl = getRedirectUrlForUser(user, subdomain);
    if (redirectUrl == null || router.asPath === redirectUrl) {
      return;
    }
    await router.push(redirectUrl);
  };

  const handleFormDataChange = () => {
    localDispatch(setErrorMessage(null));
  };

  /**
   * Request password reset for user
   * @param {string} username
   * @return {Promise<void>}
   */
  const handleResetPasswordSubmit = async (username) => {
    localDispatch(setIsLoading(true));
    try {
      const { data } = await resetUserPassword({ username });
      if (data.error) {
        localDispatch(setErrorMessage(data.message));
      } else {
        toast.success(textForKey("We've sent an email with further instructions."))
        localDispatch(setErrorMessage(null));
        handleFormChange(FormType.login);
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      localDispatch(setIsLoading(false));
    }
  }

  /**
   * Called when user is authenticated successfully
   * @param {{ clinics: any[] }} user
   * @param {string} token
   * @return {Promise<void>}
   */
  const handleUserAuthenticated = async (user, token) => {
    localDispatch(setErrorMessage(null));
    const [subdomain] = window.location.host.split('.');
    if (RestrictedSubdomains.includes(subdomain)) {
      if (user.clinics.length > 1) {
        // user has more than one clinic so we need to allow to select a clinic
        await router.replace('/clinics');
        return;
      }
      // user has only one clinic so we can select automatically it and redirect user to clinic page
      const clinic = user.clinics[0];
      await signOut();
      const clinicUrl = getClinicUrl(clinic, token);
      await router.replace(clinicUrl);
    } else {
      // user is on clinic page so we need to open selected clinic
      await handleSuccessResponse(user, subdomain);
    }
  }

  /**
   * Called when an action is received from server. Used to redirect user to create a clinic or to select one
   * @param {'CreateClinic'|'SelectClinic'} action
   * @return {Promise<void>}
   */
  const handleLoginActionReceived = async (action) => {
    switch (action) {
      case 'CreateClinic':
        await router.push('/create-clinic?redirect=1');
        break;
      case 'SelectClinic':
        await router.replace('/clinics');
        break;
      default:
        localDispatch(setIsLoading(false));
        break;
    }
  }

  /**
   * Called when login crash is caught
   * @param {any} error
   */
  const handleLoginError = (error) => {
    const { response, message } = error
    if (response != null) {
      toast.error(textForKey(response.data.message ?? message));
      localDispatch(setErrorMessage(response.data.message));
    } else {
      toast.error(message);
      localDispatch(setErrorMessage(message));
    }
    localDispatch(setIsLoading(false));
  }

  /**
   * Authenticate user
   * @param {string} username
   * @param {string} password
   * @return {Promise<void>}
   */
  const handleLoginSubmit = async (username, password) => {
    localDispatch(setIsLoading(true));
    try {
      const { data } = await loginUser({ username, password });
      const { error, action, user, token } = data;
      if (error) {
        localDispatch(setErrorMessage(data.message));
        localDispatch(setIsLoading(false));
      } else {
        if (action == null) {
          localDispatch(setErrorMessage(null));
          await handleUserAuthenticated(user, token);
        } else {
          await handleLoginActionReceived(action);
        }
      }
    } catch (error) {
      handleLoginError(error);
    }
  }

  return (
    <div className={styles.loginFormRoot}>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {!isMobileDevice && (
        <div className={styles.logoContainer}>
          <img
            className={styles.logoImage}
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
            className={styles.logoImage}
            src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
            alt='EasyPlan'
          />
        )}
        {currentForm === FormType.login && (
          <LoginForm
            isMobile={isMobileDevice}
            errorMessage={errorMessage}
            isLoggingIn={isLoading}
            onLogin={handleLoginSubmit}
            onSignUp={handleGoToSignUp}
            onChange={handleFormDataChange}
            onResetPassword={handleGoToResetPassword}
          />
        )}
        {currentForm === FormType.resetPassword && (
          <ResetPassword
            isMobile={isMobileDevice}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={handleResetPasswordSubmit}
            onGoBack={handleOpenLogin}
          />
        )}
      </div>
    </div>
  );
};
