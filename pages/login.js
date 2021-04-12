import React, { useReducer } from 'react';

import LoginForm from '../components/login/LoginForm';
import ResetPassword from '../components/login/ResetPassword';
import { useRouter } from 'next/router';
import styles from '../styles/auth/Login.module.scss';
import { generateReducerActions, getRedirectUrlForUser } from "../utils/helperFuncs";
import { toast } from "react-toastify";
import { textForKey } from "../utils/localization";
import { loginUser, resetUserPassword } from "../middleware/api/auth";
import { isDev } from "../eas.config";
import { Typography } from "@material-ui/core";

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
}

const Login = () => {
  const router = useRouter();
  const [{ currentForm, isLoading, errorMessage }, localDispatch] = useReducer(reducer, initialState);

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
    await router.replace(redirectUrl);
  }

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
      const { response, message } = error;
      if (response != null) {
        toast.error(response.data.message ?? message);
        localDispatch(actions.setErrorMessage(response.data.message ?? message));
      } else {
        toast.error(message);
        localDispatch(actions.setErrorMessage(message))
      }
    } finally {
      localDispatch(actions.setIsLoading(false));
    }
  }

  const handleLoginSubmit = async (username, password) => {
    localDispatch(actions.setIsLoading(true));
    try {
      const { data } = await loginUser({ username, password });
      const { error, action, user } = data;
      if (error) {
        localDispatch(actions.setErrorMessage(data.message));
        localDispatch(actions.setIsLoading(false));
      } else {
        if (action == null) {
          localDispatch(actions.setErrorMessage(null));
          await handleSuccessResponse(user);
        } else {
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
      }
    } catch (error) {
      const { response, message } = error
      if (response != null) {
        toast.error(textForKey(response.data.message));
        localDispatch(actions.setErrorMessage(response.data.message));
      } else {
        toast.error(message);
        localDispatch(actions.setErrorMessage(message));
      }
      localDispatch(actions.setIsLoading(false));
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
  return {
    props: {}
  }
}

export default Login;
