import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslate } from 'react-polyglot';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import { EmailRegex } from 'app/utils/constants';
import styles from './ResetPassword.module.scss';

const ResetPassword = ({ isLoading, isMobile, onSubmit, onGoBack }) => {
  const textForKey = useTranslate();
  const [email, setEmail] = useState('');
  const isEmailValid = email.length === 0 || email.match(EmailRegex);

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
        padding: isMobile ? '1rem' : '2rem',
        width: isMobile ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
      }}
    >
      <span className='form-title'>{textForKey('reset password')}</span>
      <span className='welcome-text'>
        {textForKey('reset_password_message')}
      </span>
      <form onSubmit={handleResetPassword}>
        <EASTextField
          id='emailField'
          type='email'
          error={!isEmailValid}
          helperText={isEmailValid ? null : textForKey('email_invalid_message')}
          fieldLabel={textForKey('email')}
          value={email}
          onChange={handleFormChange}
        />
        <div className='footer'>
          <Box
            role='button'
            tabIndex={0}
            className='back-button'
            onClick={onGoBack}
          >
            {textForKey('go back')}
          </Box>
          <LoadingButton
            type='submit'
            isLoading={isLoading}
            onClick={handleResetPassword}
            className='positive-button'
            disabled={!isFormValid}
          >
            {textForKey('reset password')}
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
