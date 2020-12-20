import React, { useReducer } from 'react';

import { Typography } from '@material-ui/core';
import { Form, InputGroup } from 'react-bootstrap';

import { generateReducerActions } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import LoadingButton from '../LoadingButton';

const initialState = {
  email: '',
  password: '',
  partnerToken: '',
  isLoading: false,
};

const reducerTypes = {
  setEmail: 'setEmail',
  setPassword: 'setPassword',
  setPartnerToken: 'setPartnerToken',
  setIsLoading: 'setIsLoading',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setPassword:
      return { ...state, password: action.payload };
    case reducerTypes.setEmail:
      return { ...state, email: action.payload };
    case reducerTypes.setPartnerToken:
      return { ...state, partnerToken: action.payload };
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthenticationStep = props => {
  const [
    { email, password, partnerToken, isLoading },
    localDispatch,
  ] = useReducer(reducer, initialState);

  const handleFormChange = event => {
    const targetId = event.target.id;
    switch (targetId) {
      case 'email':
        localDispatch(actions.setEmail(event.target.value));
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
    return true;
  };

  const handleLogin = () => {};

  return (
    <div className='authentication-step'>
      <Typography classes={{ root: 'form-title' }}>
        {textForKey('Authenticate with Yclients account')}
      </Typography>
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
          <Form.Control value={email} type='text' onChange={handleFormChange} />
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

      <Typography classes={{ root: 'explanation-label' }}>
        {textForKey('yclients_auth_explanation')}
      </Typography>
    </div>
  );
};

export default AuthenticationStep;
