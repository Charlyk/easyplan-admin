import React, { useState } from 'react';

import { Form, InputGroup } from 'react-bootstrap';
import { useParams, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import LoadingButton from '../../components/LoadingButton';
import './ResetPassword.module.scss';
import authAPI from '../../utils/api/authAPI';
import { JwtRegex, PasswordRegex } from '../../utils/constants';
import { updateLink } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [state, setState] = useState({
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    errorMessage: null,
    redirectUser: false,
  });

  const handleFormChange = event => {
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

  const handleSavePassword = async () => {
    setState({ ...state, isLoading: true });
    const response = await authAPI.changeUserPassword({
      newPassword: state.newPassword,
      resetToken: token,
    });

    if (response.isError) {
      toast.error(textForKey(response.message));
      setState({ ...state, errorMessage: response.message });
    } else {
      setState({ ...state, redirectUser: true });
    }

    setState({ ...state, isLoading: false });
  };

  const isFormValid = () => {
    return (
      state.newPassword.match(PasswordRegex) &&
      state.confirmPassword === state.newPassword
    );
  };

  if (state.redirectUser || !token.match(JwtRegex)) {
    return <Redirect to={updateLink('/login')} />;
  }

  return (
    <div className='general-page'>
      <div className='logo-container'>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className='form-container'>
        <div className='form-root accept-invitation'>
          <div className='form-wrapper'>
            <span className='form-title'>
              {textForKey('Create new password')}
            </span>
            <span className='welcome-text'>
              {textForKey('change password message')}
            </span>
            <Form.Group controlId='newPassword'>
              <Form.Label>{textForKey('Enter a new password')}</Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={
                    state.newPassword.length > 0 &&
                    !state.newPassword.match(PasswordRegex)
                  }
                  autoComplete='new-password'
                  value={state.newPassword}
                  onChange={handleFormChange}
                  type='password'
                />
                <Form.Text className='text-muted'>
                  {textForKey('passwordValidationMessage')}
                </Form.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId='confirmPassword'>
              <Form.Label>{textForKey('Confirm password')}</Form.Label>
              <InputGroup>
                <Form.Control
                  autoComplete='new-password'
                  isInvalid={
                    state.confirmPassword.length > 0 &&
                    state.confirmPassword !== state.newPassword
                  }
                  value={state.confirmPassword}
                  onChange={handleFormChange}
                  type='password'
                />
              </InputGroup>
            </Form.Group>
          </div>
          <div className='footer'>
            <LoadingButton
              onClick={handleSavePassword}
              isLoading={state.isLoading}
              disabled={!isFormValid() || state.isLoading}
              className='positive-button'
            >
              {textForKey('Save')}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
