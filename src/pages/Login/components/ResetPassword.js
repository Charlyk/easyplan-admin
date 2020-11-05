import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import LoadingButton from '../../../components/LoadingButton';
import authAPI from '../../../utils/api/authAPI';
import { EmailRegex } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';

const ResetPassword = ({ onGoBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFormChange = event => {
    setEmail(event.target.value);
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    const response = await authAPI.requestResetPassword(email);
    if (response.isError) {
      console.log(response.message);
    } else {
      setIsSuccess(true);
    }
    setIsLoading(false);
  };

  return (
    <div className='form-root reset-password-form'>
      <span className='form-title'>{textForKey('Reset Password')}</span>
      <span className='welcome-text'>
        {textForKey('reset_password_message')}
      </span>
      {!isSuccess ? (
        <Form.Group controlId='email'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control
              value={email}
              type='email'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
      ) : (
        <span className='success-text'>
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
            disabled={!email.match(EmailRegex)}
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
