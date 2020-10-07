import React, { useEffect, useState } from 'react';

import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { useParams, Redirect } from 'react-router-dom';

import appLogo from '../../assets/images/easyplan-logo.svg';
import LoadingButton from '../../components/LoadingButton';
import dataAPI from '../../utils/api/dataAPI';
import { textForKey } from '../../utils/localization';
import './styles.scss';
import authManager from '../../utils/settings/authManager';

const AcceptInvitation = () => {
  const { isNew, token } = useParams();
  const [state, setState] = useState({
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    redirectToLogin: false,
    errorMessage: null,
  });

  useEffect(() => {
    if (!isNew && !state.isLoading) {
      handleAcceptInvitation();
    }
  }, [isNew, token]);

  const handleFormChange = event => {
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

  const isFormValid = () => {
    return (
      state.newPassword.length >= 8 &&
      state.confirmPassword === state.newPassword
    );
  };

  const handleAcceptInvitation = async () => {
    setState({ ...state, isLoading: true });
    const response = await dataAPI.acceptClinicInvitation(
      token,
      state.newPassword,
    );
    if (response.isError) {
      console.error(response.message);
      setState({ ...state, isLoading: false, errorMessage: response.message });
    } else {
      setState({
        redirectToLogin: true,
        isLoading: false,
        newPassword: '',
        confirmPassword: '',
        errorMessage: null,
      });
    }
  };

  if (state.redirectToLogin) {
    return <Redirect to={authManager.isLoggedIn() ? '/' : '/login'} />;
  }

  return (
    <div className='general-page'>
      <div className='logo-container'>
        <img src={appLogo} alt='EasyPlan' />
      </div>
      <div className='form-container'>
        <div className='form-root accept-invitation'>
          {!isNew && !state.errorMessage && (
            <Spinner animation='border' className='loading-spinner' />
          )}
          {!isNew && state.errorMessage && (
            <span className='error-message'>{state.errorMessage}</span>
          )}
          {isNew && (
            <div className='form-wrapper'>
              <span className='form-title'>
                {textForKey('Accept invitation')}
              </span>
              <span className='welcome-text'>
                {textForKey('accept invitation message')}
              </span>
              <Form.Group controlId='newPassword'>
                <Form.Label>{textForKey('Enter a new password')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    autoComplete='new-password'
                    value={state.newPassword}
                    onChange={handleFormChange}
                    type='password'
                  />
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
          )}
          {isNew && (
            <div className='footer'>
              <LoadingButton
                disabled={!isFormValid()}
                className='positive-button'
                onClick={handleAcceptInvitation}
              >
                {textForKey('Accept invitation')}
              </LoadingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
