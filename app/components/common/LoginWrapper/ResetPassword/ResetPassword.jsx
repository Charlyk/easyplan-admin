import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import clsx from "clsx";

import LoadingButton from '../../LoadingButton';
import { EmailRegex } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import styles from './ResetPassword.module.scss';
import EASTextField from "../../EASTextField";

const ResetPassword = ({ isLoading, errorMessage, isMobile, onSubmit, onGoBack }) => {
  const [email, setEmail] = useState('');

  const handleFormChange = (newValue) => {
    setEmail(newValue);
  };

  const isFormValid = email.match(EmailRegex);

  const handleResetPassword = async (event) => {
    event?.preventDefault();
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
      <form onSubmit={handleResetPassword}>
        <EASTextField
          type="email"
          fieldLabel={textForKey('Email')}
          value={email}
          onChange={handleFormChange}
        />
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
            type="submit"
            isLoading={isLoading}
            onClick={handleResetPassword}
            className='positive-button'
            disabled={!isFormValid}
          >
            {textForKey('Reset password')}
          </LoadingButton>
        </div>
      </form>
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
