import React, { useEffect, useReducer } from 'react';

import LoginForm from '../components/login/LoginForm';
import ResetPassword from '../components/login/ResetPassword';
import { useRouter } from 'next/router';
import { generateReducerActions, getClinicUrl, getRedirectUrlForUser } from "../utils/helperFuncs";
import { toast } from "react-toastify";
import { textForKey } from "../utils/localization";
import { getCurrentUser, loginUser, resetUserPassword } from "../middleware/api/auth";
import { isDev } from "../eas.config";
import { Typography } from "@material-ui/core";
import { RestrictedSubdomains } from "../app/utils/constants";
import styles from '../styles/auth/Login.module.scss';

const FormType = {
  login: 'login',
  resetPassword: 'resetPassword',
};

const initialState = {
  currentForm: FormType.login,
  isLoading: false,
  errorMessage: null,
};

const reducerTypes = {
  setCurrentForm: 'setCurrentForm',
  setIsLoading: 'setIsLoading',
  setErrorMessage: 'setErrorMessage',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return {
        ...state,
        isLoading: action.payload,
        errorMessage: action.payload ? null : state.errorMessage
      };
    case reducerTypes.setCurrentForm:
      return { ...state, currentForm: action.payload };
    case reducerTypes.setErrorMessage:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

export default function Login({ currentUser }) {
  const router = useRouter();
  const [{ currentForm, isLoading, errorMessage }, localDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (currentUser != null) {
      router.replace('/clinics');
    }
  }, [currentUser])

  const handleFormChange = (newForm) => {
    localDispatch(actions.setCurrentForm(newForm));
  }

  const handleOpenLogin = () => {
    handleFormChange(FormType.login)
  };

  const handleGoToResetPassword = () => {
    handleFormChange(FormType.resetPassword);
  };

  const handleGoToSignUp = async () => {
    await router.push('/register');
  };

  const handleSuccessResponse = async (user) => {
    const redirectUrl = getRedirectUrlForUser(user);
    if (redirectUrl == null || router.asPath === redirectUrl) {
      return;
    }
    await router.replace(redirectUrl);
  }

  /**
   * Request password reset for user
   * @param {string} username
   * @return {Promise<void>}
   */
  const handleResetPasswordSubmit = async (username) => {
    localDispatch(actions.setIsLoading(true));
    try {
      const { data } = await resetUserPassword({ username });
      if (data.error) {
        localDispatch(actions.setErrorMessage(data.message));
      } else {
        toast.success(textForKey("We've sent an email with further instructions."))
        localDispatch(actions.setErrorMessage(null));
        handleFormChange(FormType.login);
      }
    } catch (error) {
      handleLoginError(error);
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  }

  /**
   * Called when user is authenticated successfully
   * @param {{ clinics: any[] }} user
   * @param {string} token
   * @return {Promise<void>}
   */
  const handleUserAuthenticated = async (user, token) => {
    localDispatch(actions.setErrorMessage(null));
    const [subdomain] = window.location.host.split('.');
    if (RestrictedSubdomains.includes(subdomain)) {
      const clinic = user.clinics[0];
      const clinicUrl = getClinicUrl(clinic, token);
      await router.replace(clinicUrl);
    } else {
      await handleSuccessResponse(user);
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
        await router.push('/clinics');
        break;
      default:
        localDispatch(actions.setIsLoading(false));
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
      localDispatch(actions.setErrorMessage(response.data.message));
    } else {
      toast.error(message);
      localDispatch(actions.setErrorMessage(message));
    }
    localDispatch(actions.setIsLoading(false));
  }

  /**
   * Authenticate user
   * @param {string} username
   * @param {string} password
   * @return {Promise<void>}
   */
  const handleLoginSubmit = async (username, password) => {
    localDispatch(actions.setIsLoading(true));
    try {
      const { data } = await loginUser({ username, password });
      const { error, action, user, token } = data;
      if (error) {
        localDispatch(actions.setErrorMessage(data.message));
        localDispatch(actions.setIsLoading(false));
      } else {
        if (action == null) {
          localDispatch(actions.setErrorMessage(null));
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
    <div className={styles['login-form-root']}>
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      <div className={styles['logo-container']}>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className={styles['form-container']}>
        {currentForm === FormType.login && (
          <LoginForm
            errorMessage={errorMessage}
            isLoggingIn={isLoading}
            onLogin={handleLoginSubmit}
            onSignUp={handleGoToSignUp}
            onResetPassword={handleGoToResetPassword}
          />
        )}
        {currentForm === FormType.resetPassword && (
          <ResetPassword
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

export const getServerSideProps = async ({ req }) => {
  try {
    const response = await getCurrentUser(req.headers);
    return {
      props: {
        currentUser: response.data,
      },
    };
  } catch (error) {
    return {
      props: {}
    }
  }
}
