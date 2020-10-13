import React, { useEffect, useState } from 'react';

import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { useParams, useHistory, Redirect } from 'react-router-dom';

import appLogo from '../../assets/images/easyplan-logo.svg';
import LoadingButton from '../../components/LoadingButton';
import dataAPI from '../../utils/api/dataAPI';
import { JwtRegex } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import './styles.scss';
import authManager from '../../utils/settings/authManager';

import clsx from 'clsx';

const AcceptInvitation = () => {
  const history = useHistory();
  const { isNew, token } = useParams();
  const [state, setState] = useState({
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    errorMessage: null,
    isAccepted: false,
  });

  useEffect(() => {
    if (!isNew && !state.isLoading) {
      try {
        handleAcceptInvitation();
      } catch (e) {
        console.log(e.message);
      }
    }
  }, [isNew, token]);

  if (!token.match(JwtRegex)) {
    return <Redirect to='/login' />;
  }

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
    if (state.isAccepted) {
      history.push(authManager.isLoggedIn() ? '/' : '/login');
      return;
    }
    setState({ ...state, isLoading: true });
    const response = await dataAPI.acceptClinicInvitation(
      token,
      state.newPassword,
    );
    if (response.isError) {
      setState({
        ...state,
        isLoading: false,
        errorMessage: response.message,
        isAccepted: true,
      });
    } else {
      setState({
        isLoading: false,
        newPassword: '',
        confirmPassword: '',
        errorMessage: null,
        isAccepted: true,
      });
    }
  };

  return (
    <div className='general-page'>
      <div className='logo-container'>
        <img src={appLogo} alt='EasyPlan' />
      </div>
      <div className='form-container'>
        <div className='form-root accept-invitation'>
          {!isNew && !state.errorMessage && !state.isAccepted && (
            <Spinner animation='border' className='loading-spinner' />
          )}
          {!isNew && state.errorMessage && (
            <span className='error-message'>{state.errorMessage}</span>
          )}
          {state.isAccepted && !state.errorMessage && (
            <span className='success-message'>
              {textForKey('Inivtation accepted')}
            </span>
          )}
          {isNew && !state.isAccepted && (
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
          {(isNew || state.isAccepted) && (
            <div className={clsx('footer', !isNew && 'is-new')}>
              <LoadingButton
                isLoading={state.isLoading}
                disabled={
                  !state.isAccepted && (!isFormValid() || state.isLoading)
                }
                className='positive-button'
                onClick={handleAcceptInvitation}
              >
                {state.isAccepted
                  ? textForKey('Go to login')
                  : textForKey('Accept invitation')}
              </LoadingButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
