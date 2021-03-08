import React, { useReducer } from 'react';

import LoginForm from '../components/login/LoginForm';
import RegisterForm from '../components/login/RegisterForm';
import ResetPassword from '../components/login/ResetPassword';
import Router from 'next/router';
import styles from '../styles/Login.module.scss';
import { generateReducerActions, uploadFileToAWS } from "../utils/helperFuncs";
import axios from "axios";
import { toast } from "react-toastify";
import { textForKey } from "../utils/localization";
import { useDispatch } from "react-redux";
import { wrapper } from "../store";
import { setCurrentUser } from "../redux/actions/actions";
import { baseAppUrl } from "../eas.config";

const FormType = {
  login: 'login',
  resetPassword: 'resetPassword',
  register: 'register',
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
  const dispatch = useDispatch();
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

  const handleGoToSignUp = () => {
    handleFormChange(FormType.register);
  };

  const handleSignupSubmit = async (requestBody) => {
    localDispatch(actions.setIsLoading(true));
    if (requestBody.avatarFile != null) {
      const uploadResult = await uploadFileToAWS('avatars', requestBody.avatarFile);
      requestBody.avatar = uploadResult?.location;
      delete requestBody.avatarFile;
    }

    const { data } = await axios.post(
      `${baseAppUrl}/api/auth/register`,
      requestBody,
    );
    if (data.error) {
      localDispatch(actions.setErrorMessage(data.message));
    } else {
      localDispatch(actions.setErrorMessage(null));
      dispatch(setCurrentUser(data));
      await Router.replace('/analytics/general');
    }
    localDispatch(actions.setIsLoading(false));
  };

  const handleResetPasswordSubmit = async (username) => {
    localDispatch(actions.setIsLoading(true));
    const { data } = await axios.post(
      `${baseAppUrl}/api/auth/reset-password`,
      { username }
    );
    if (data.error) {
      localDispatch(actions.setErrorMessage(data.message));
    } else {
      toast.success(textForKey("We've sent an email with further instructions."))
      localDispatch(actions.setErrorMessage(null));
      handleFormChange(FormType.login);
    }
    localDispatch(actions.setIsLoading(false));
  }

  const handleLoginSubmit = async (username, password) => {
    localDispatch(actions.setIsLoading(true));
    const { data } = await axios.post(
      `${baseAppUrl}/api/auth/login`,
      { username, password }
    );
    if (data.error) {
      localDispatch(actions.setErrorMessage(data.message));
    } else {
      localDispatch(actions.setErrorMessage(null));
      dispatch(setCurrentUser(data));
      await Router.replace('/analytics/general');
    }
    localDispatch(actions.setIsLoading(false));
  }

  return (
    <div className={styles['login-form-root']}>
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
        {currentForm === FormType.register && (
          <RegisterForm
            isLoading={isLoading}
            errorMessage={errorMessage}
            onSubmit={handleSignupSubmit}
            onGoBack={handleOpenLogin}
          />
        )}
      </div>
    </div>
  );
};

export default wrapper.withRedux(Login);
