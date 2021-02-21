import React, { useReducer } from 'react';

import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { YClientAPIUrl } from '../../../utils/constants';
import { generateReducerActions } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import LoadingButton from '../../LoadingButton';
import styles from './AuthenticationStep.module.scss'

const initialState = {
  username: 'dentino.dentus@gmail.com',
  password: 'tezpd4',
  partnerToken: 'u8xzkdpkgfc73uektn64',
  isLoading: false,
};

// const initialState = {
//   username: '',
//   password: '',
//   partnerToken: '',
//   isLoading: false,
// };

const reducerTypes = {
  setUsername: 'setUsername',
  setPassword: 'setPassword',
  setPartnerToken: 'setPartnerToken',
  setIsLoading: 'setIsLoading',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPassword:
      return { ...state, password: action.payload };
    case reducerTypes.setUsername:
      return { ...state, username: action.payload };
    case reducerTypes.setPartnerToken:
      return { ...state, partnerToken: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthenticationStep = ({ onLogin }) => {
  const [
    { username, password, partnerToken, isLoading },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const handleFormChange = (event) => {
    const targetId = event.target.id;
    switch (targetId) {
      case 'username':
        localDispatch(actions.setUsername(event.target.value));
        break;
      case 'password':
        localDispatch(actions.setPassword(event.target.value));
        break;
      case 'partnerToken':
        localDispatch(actions.setPartnerToken(event.target.value));
        break;
    }
  };

  const isFormValid = () => {
    return (
      username.length > 0 && password.length > 0 && partnerToken.length > 0
    );
  };

  const handleLogin = async () => {
    localDispatch(actions.setIsLoading(true));
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${partnerToken}`,
        Accept: 'application/vnd.yclients.v2+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: username,
        password,
      }),
    };
    const response = await fetch(`${YClientAPIUrl}/v1/auth`, requestOptions);
    const responseData = await response.json();
    if (!responseData.success) {
      toast.error(responseData.meta.message);
    } else {
      onLogin({ ...responseData.data, partnerToken });
    }
    localDispatch(actions.setIsLoading(false));
  };

  return (
    <div className={styles['authentication-step']}>
      <Typography classes={{ root: styles['form-title'] }}>
        {textForKey('Authenticate with Yclients account')}
      </Typography>
      <Form.Group controlId='username'>
        <Form.Label>{textForKey('Username')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={username}
            type='email'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>{textForKey('Password')}</Form.Label>
        <InputGroup>
          <Form.Control
            autocomplete='new-password'
            value={password}
            type='password'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='partnerToken'>
        <Form.Label>{textForKey('Partner token')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={partnerToken}
            type='text'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <LoadingButton
        onClick={handleLogin}
        className='positive-button'
        disabled={!isFormValid() || isLoading}
        isLoading={isLoading}
      >
        {textForKey('Login')}
      </LoadingButton>

      <Typography classes={{ root: styles['explanation-label'] }}>
        {textForKey('yclients_auth_explanation')}
      </Typography>
    </div>
  );
};

export default AuthenticationStep;

AuthenticationStep.propTypes = {
  onLogin: PropTypes.func,
};

AuthenticationStep.defaultProps = {
  onLogin: () => null,
};
