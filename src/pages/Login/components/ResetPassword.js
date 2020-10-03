import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import LoadingButton from '../../../components/LoadingButton';
import { textForKey } from '../../../utils/localization';

const ResetPassword = ({ onGoBack }) => {
  const [email, setEmail] = useState('');

  const handleFormChange = event => {
    setEmail(event.target.value);
  };

  return (
    <div className='form-root reset-password-form'>
      <span className='form-title'>{textForKey('Reset Password')}</span>
      <span className='welcome-text'>
        {textForKey('reset password message')}
      </span>
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
      <div className='footer'>
        <div
          role='button'
          tabIndex={0}
          className='back-button'
          onClick={onGoBack}
        >
          {textForKey('Go back')}
        </div>
        <LoadingButton className='positive-button'>
          {textForKey('Reset password')}
        </LoadingButton>
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
