import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import LoadingButton from '../../../components/LoadingButton';
import authAPI from '../../../utils/api/authAPI';
import { EmailRegex } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';
import styles from './ResetPassword.module.scss';
import clsx from "clsx";

const ResetPassword = ({ onGoBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormChange = event => {
    setEmail(event.target.value);
  };

  const isFormValid = email.match(EmailRegex);

  const handleResetPassword = async () => {
    setIsLoading(true);
    const response = await authAPI.requestResetPassword(email);
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      setIsSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <div className={clsx('form-root', styles['reset-password-form'])}>
      <span className='form-title'>{textForKey('Reset Password')}</span>
      <span className='welcome-text'>
        {textForKey('reset_password_message')}
      </span>
      {!isSuccess ? (
        <Form.Group controlId='email'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control
              isInvalid={email.length > 0 && !isFormValid}
              value={email}
              type='email'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
      ) : (
        <span className={styles['success-text']}>
          {textForKey("We've sent an email with further instructions.")}
        </span>
      )}
      <div className='footer'>
        <div
          role='button'
          tabIndex={0}
          className='back-button'
          onClick={onGoBack}
        >
          {textForKey('Go back')}
        </div>
        {!isSuccess && (
          <LoadingButton
            isLoading={isLoading}
            onClick={handleResetPassword}
            className='positive-button'
            disabled={!isFormValid}
          >
            {textForKey('Reset password')}
          </LoadingButton>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

ResetPassword.propTypes = {
  onGoBack: PropTypes.func,
};

ResetPassword.defaultProps = {
  onGoBack: () => null,
};
