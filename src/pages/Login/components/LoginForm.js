import React, { useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import LoadingButton from '../../../components/LoadingButton';
import { setCurrentUser } from '../../../redux/actions/actions';
import authAPI from '../../../utils/api/authAPI';
import { EmailRegex } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';
import authManager from '../../../utils/settings/authManager';

const LoginForm = ({ onResetPassword, onSignUp }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFormChange = event => {
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handleLogin = async () => {
    if (
      isLoading ||
      !data.email.match(EmailRegex) ||
      data.password.length < 8
    ) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    const response = await authAPI.login(data.email, data.password);
    if (response.isError) {
      setErrorMessage(response.message);
    } else {
      authManager.setUserToken(response?.data?.token);
      dispatch(setCurrentUser(response?.data?.user));
    }
    setIsLoading(false);
  };

  const isFormValid = () => {
    return data.email.match(EmailRegex) && data.password.length > 4;
  };

  if (authManager.isLoggedIn()) {
    return <Redirect to='/' />;
  }

  return (
    <div className={clsx('form-root login-form', isLoading && 'disabled')}>
      <span className='welcome-text'>{textForKey('Welcome to EasyPlan')}</span>
      <span className='form-title'>{textForKey('Log in to your account')}</span>
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
        <div className='forgot-password-container'>
          <Form.Label>{textForKey('Password')}</Form.Label>
          <div
            role='button'
            tabIndex={0}
            className='forgot-button'
            onClick={onResetPassword}
          >
            {textForKey('Forgot your password?')}
          </div>
        </div>
        <InputGroup>
          <Form.Control
            value={data.password}
            type='password'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <div className='footer'>
        <div className='footer-sign-up'>
          <span className='text'>{textForKey("Don't have an account?")}</span>
          <div
            role='button'
            tabIndex={0}
            className='sign-up-btn'
            onClick={onSignUp}
          >
            {textForKey('Sign Up')}
          </div>
        </div>
        <LoadingButton
          onClick={handleLogin}
          className='positive-button'
          disabled={!isFormValid()}
          isLoading={isLoading}
        >
          {textForKey('Login')}
        </LoadingButton>
      </div>
    </div>
  );
};

export default LoginForm;

LoginForm.propTypes = {
  onResetPassword: PropTypes.func,
  onSignUp: PropTypes.func,
};

LoginForm.defaultProps = {
  onResetPassword: () => null,
  onSignUp: () => null,
};
