import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Alert } from '@material-ui/lab';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import { EmailRegex } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import styles from './LoginForm.module.scss';

const LoginForm = ({
  isLoggingIn,
  errorMessage,
  isMobile,
  onResetPassword,
  onSignUp,
  onLogin,
  onChange,
}) => {
  const [data, setData] = useState({ email: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isEmailValid = data.email.length === 0 || data.email.match(EmailRegex);

  useEffect(() => {
    onChange?.(data);
  }, [data]);

  const handleEmailChange = (newValue) => {
    setData({ ...data, email: newValue });
  };

  const handlePasswordChange = (newValue) => {
    setData({ ...data, password: newValue });
  };

  const isFormValid = () => {
    return data.email.match(EmailRegex) && data.password.length > 4;
  };

  const handleLogin = async (event) => {
    event?.preventDefault();
    if (isLoggingIn || !isFormValid()) {
      return;
    }
    onLogin(data.email, data.password);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div
      className={clsx('form-root', styles.loginForm, {
        [styles.disabled]: isLoggingIn,
      })}
      style={{
        padding: isMobile ? '1rem' : '2rem',
        width: isMobile ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
      }}
    >
      <span className='welcome-text'>{textForKey('Welcome to EasyPlan')}</span>
      <span className='form-title' style={{ marginBottom: '1rem' }}>
        {textForKey('Log in to your account')}
      </span>
      <form onSubmit={handleLogin}>
        <EASTextField
          id='emailField'
          value={data.email}
          error={!isEmailValid}
          type='email'
          containerClass={styles.fieldContainer}
          fieldLabel={textForKey('Email')}
          onChange={handleEmailChange}
        />

        <div className={styles.passwordContainer}>
          <EASTextField
            id='passwordField'
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
                {isPasswordVisible ? <VisibilityOff /> : <VisibilityOn />}
              </IconButton>
            }
          />
          <Box className={styles.forgotButton} onClick={onResetPassword}>
            {textForKey('Forgot your password')}?
          </Box>
        </div>

        <div
          className='footer'
          style={{
            marginBottom: errorMessage ? '1rem' : 0,
          }}
        >
          <div className={styles.footerSignUp}>
            <span className='text'>{textForKey("Don't have an account")}?</span>
            <Box className={styles.signUpBtn} onClick={onSignUp}>
              {textForKey('Sign Up')}
            </Box>
          </div>
          <LoadingButton
            type='submit'
            onClick={handleLogin}
            className='positive-button'
            disabled={!isFormValid() || isLoggingIn}
            isLoading={isLoggingIn}
            style={{
              width: isMobile ? '6rem' : 'unset',
              minWidth: isMobile ? 'unset' : '8rem',
            }}
          >
            {textForKey('Login')}
          </LoadingButton>
        </div>
        {errorMessage && (
          <Alert severity='error'>{textForKey(errorMessage)}</Alert>
        )}
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
