import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import VisibilityOn from "@material-ui/icons/Visibility";

import LoadingButton from '../../../../../components/common/LoadingButton';
import { EmailRegex } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import styles from './LoginForm.module.scss';

const LoginForm = ({ isLoggingIn, errorMessage, isMobile, onResetPassword, onSignUp, onLogin }) => {
  const [data, setData] = useState({ email: '', password: '' });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFormChange = (event) => {
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const isFormValid = () => {
    return data.email.match(EmailRegex) && data.password.length > 4;
  };

  const handleLogin = async () => {
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
        padding: isMobile ? '2rem' : '3rem',
        width: isMobile ? '90%' : '70%',
      }}
    >
      <span className='welcome-text'>{textForKey('Welcome to EasyPlan')}</span>
      <span className='form-title' style={{ marginBottom: isMobile ? '1rem' : '3rem' }}>
        {textForKey('Log in to your account')}
      </span>
      {errorMessage && (
        <span className='error-text'>{textForKey(errorMessage)}</span>
      )}
      <Form.Group controlId='email'>
        <Form.Label>{textForKey('Email')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={data.email}
            type='email'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='password'>
        <div className={styles.forgotPasswordContainer}>
          <Form.Label>{textForKey('Password')}</Form.Label>
          <div
            role='button'
            tabIndex={0}
            className={styles.forgotButton}
            onClick={onResetPassword}
          >
            {textForKey('Forgot your password')}?
          </div>
        </div>
        <InputGroup>
          <Form.Control
            value={data.password}
            type={isPasswordVisible ? 'text' : 'password'}
            onChange={handleFormChange}
          />
          <InputGroup.Append className={styles.passwordVisibilityAppend}>
            <Button
              onClick={togglePasswordVisibility}
              variant='outline-primary'
              className={styles.visibilityToggleBtn}
            >
              {isPasswordVisible ? <VisibilityOff /> : <VisibilityOn />}
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
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
