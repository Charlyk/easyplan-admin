import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import clsx from "clsx";

import LoadingButton from '../../../../../components/common/LoadingButton';
import { EmailRegex } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import styles from './ResetPassword.module.scss';

const ResetPassword = ({ isLoading, errorMessage, isMobile, onSubmit, onGoBack }) => {
  const [email, setEmail] = useState('');

  const handleFormChange = event => {
    setEmail(event.target.value);
  };

  const isFormValid = email.match(EmailRegex);

  const handleResetPassword = async () => {
    if (!isFormValid || isLoading) {
      return;
    }
    onSubmit(email);
    setEmail('');
  };

  return (
    <div
      className={clsx('form-root', styles['reset-password-form'])}
      style={{
        padding: isMobile ? '2rem' : '3rem',
        width: isMobile ? '90%' : '70%',
      }}
    >
      <span className='form-title'>{textForKey('Reset Password')}</span>
      <span className='welcome-text'>
        {textForKey('reset_password_message')}
      </span>
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
      <div className='footer'>
        <div
          role='button'
          tabIndex={0}
          className='back-button'
          onClick={onGoBack}
        >
          {textForKey('Go back')}
        </div>
        <LoadingButton
          isLoading={isLoading}
          onClick={handleResetPassword}
          className='positive-button'
          disabled={!isFormValid}
        >
          {textForKey('Reset password')}
        </LoadingButton>
      </div>
    </div>
  );
};

export default ResetPassword;

ResetPassword.propTypes = {
  errorMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  onGoBack: PropTypes.func,
};

ResetPassword.defaultProps = {
  isLoading: false,
  errorMessage: null,
  onSubmit: () => null,
  onGoBack: () => null,
};
