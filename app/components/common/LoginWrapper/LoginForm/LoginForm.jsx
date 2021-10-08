import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import VisibilityOn from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";

import { EmailRegex } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import LoadingButton from '../../LoadingButton';
import EASTextField from "../../EASTextField";
import styles from './LoginForm.module.scss';

const LoginForm = ({ isLoggingIn, errorMessage, isMobile, onResetPassword, onSignUp, onLogin }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleEmailChange = (newValue) => {
    setData({ ...data, email: newValue });
  }

  const handlePasswordChange = (newValue) => {
    setData({ ...data, password: newValue });
  }

  const isFormValid = () => {
    return data.email.match(EmailRegex) && data.password.length > 4;
  };

  const handleLogin = async (event) => {
    event?.preventDefault();
    if (isLoggingIn || !isFormValid()) {
      return;
    }
    onLogin(data.email, data.password)
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div
      className={clsx(
        'form-root',
        styles.loginForm,
        {
          [styles.disabled]: isLoggingIn,
        }
      )}
      style={{
        padding: isMobile ? '1rem' : '2rem',
        width: isMobile ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
      }}
    >
      <span className='welcome-text'>{textForKey('Welcome to EasyPlan')}</span>
      <span className='form-title' style={{ marginBottom: '1rem' }}>
        {textForKey('Log in to your account')}
      </span>
      {errorMessage && (
        <span className='error-text'>{textForKey(errorMessage)}</span>
      )}

      <form onSubmit={handleLogin}>
        <EASTextField
          value={data.email}
          type="email"
          containerClass={styles.fieldContainer}
          fieldLabel={textForKey('Email')}
          onChange={handleEmailChange}
        />

        <div className={styles.passwordContainer}>
          <EASTextField
            value={data.password}
            containerClass={clsx(styles.fieldContainer, styles.password)}
            type={isPasswordVisible ? 'text' : 'password'}
            fieldLabel={textForKey('Password')}
            onChange={handlePasswordChange}
            endAdornment={
              <IconButton
                onClick={togglePasswordVisibility}
                className={styles.visibilityToggleBtn}
              >
                {isPasswordVisible ? <VisibilityOff/> : <VisibilityOn/>}
              </IconButton>
            }
          />
          <div
            role='button'
            tabIndex={0}
            className={styles.forgotButton}
            onClick={onResetPassword}
          >
            {textForKey('Forgot your password')}?
          </div>
        </div>

        <div className='footer'>
          <div className={styles.footerSignUp}>
            <span className='text'>{textForKey("Don't have an account")}?</span>
            <div
              role='button'
              tabIndex={0}
              className={styles.signUpBtn}
              onClick={onSignUp}
            >
              {textForKey('Sign Up')}
            </div>
          </div>
          <LoadingButton
            type="submit"
            onClick={handleLogin}
            className='positive-button'
            disabled={!isFormValid() || isLoggingIn}
            isLoading={isLoggingIn}
            style={{
              width: isMobile ? '6rem' : 'unset',
              minWidth: isMobile ? 'unset' : '8rem'
            }}
          >
            {textForKey('Login')}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  errorMessage: PropTypes.string,
  isLoggingIn: PropTypes.bool,
  onResetPassword: PropTypes.func,
  onSignUp: PropTypes.func,
  onLogin: PropTypes.func,
};

LoginForm.defaultProps = {
  errorMessage: null,
  isLoggingIn: false,
  onResetPassword: () => null,
  onSignUp: () => null,
  onLogin: () => null,
};
