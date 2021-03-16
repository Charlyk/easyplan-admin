import React, { useEffect, useReducer } from 'react';

import { CircularProgress } from '@material-ui/core';
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useDispatch } from 'react-redux';
import { useParams, Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';

import IconAvatar from '../../../components/icons/iconAvatar';
import LoadingButton from '../../../components/common/LoadingButton';
import dataAPI from '../../../utils/api/dataAPI';
import { JwtRegex, PasswordRegex } from '../../../utils/constants';
import {
  generateReducerActions,
  handleUserAuthenticated,
  updateLink,
  uploadFileToAWS,
} from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import './AcceptInvitation.module.scss';

const initialState = {
  isLoading: false,
  firstName: '',
  lastName: '',
  phoneNumber: '',
  isPhoneValid: true,
  password: '',
  avatarFile: null,
  isInvitationAccepted: false,
  isPasswordVisible: false,
};

const reducerTypes = {
  setIsLoading: 'setIsLoading',
  setFirstName: 'setFirstName',
  setLastName: 'setLastName',
  setPhoneNumber: 'setPhoneNumber',
  setIsPhoneValid: 'setIsPhoneValid',
  setPassword: 'setPassword',
  setAvatarFile: 'setAvatarFile',
  setIsInvitationAccepted: 'setIsInvitationAccepted',
  setIsPasswordVisible: 'setIsPasswordVisible',
};

const actions = generateReducerActions(reducerTypes);

const reducer = (state, action) => {
  switch (action.type) {
    case reducerTypes.setIsLoading:
      return { ...state, isLoading: action.payload };
    case reducerTypes.setFirstName:
      return { ...state, firstName: action.payload };
    case reducerTypes.setLastName:
      return { ...state, lastName: action.payload };
    case reducerTypes.setPhoneNumber:
      return {
        ...state,
        phoneNumber: action.payload.number,
        isPhoneValid: action.payload.isValid,
      };
    case reducerTypes.setIsPhoneValid:
      return { ...state, isPhoneValid: action.payload };
    case reducerTypes.setPassword:
      return { ...state, password: action.payload };
    case reducerTypes.setAvatarFile:
      return { ...state, avatarFile: action.payload };
    case reducerTypes.setIsInvitationAccepted:
      return { ...state, isInvitationAccepted: action.payload };
    case reducerTypes.setIsPasswordVisible:
      return { ...state, isPasswordVisible: action.payload };
    default:
      return state;
  }
};

const AcceptInvitation = () => {
  const dispatch = useDispatch();
  const { isNew, token } = useParams();
  const [
    {
      isLoading,
      firstName,
      lastName,
      phoneNumber,
      isPhoneValid,
      password,
      avatarFile,
      isInvitationAccepted,
      isPasswordVisible,
    },
    localDispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!isNew && !isLoading && token.match(JwtRegex)) {
      try {
        handleAcceptInvitation();
      } catch (e) {
        console.log(e.message);
      }
    }
  }, [isNew, token]);

  if (!token.match(JwtRegex)) {
    return <Redirect to={updateLink('/login')} />;
  }

  const handleFirstNameChange = event => {
    localDispatch(actions.setFirstName(event.target.value));
  };

  const handleLastNameChange = event => {
    localDispatch(actions.setLastName(event.target.value));
  };

  const handleAvatarChange = event => {
    const files = event.target.files;
    if (files != null) {
      localDispatch(actions.setAvatarFile(files[0]));
    }
  };

  const handlePhoneNumberChange = (value, _, event) => {
    localDispatch(
      actions.setPhoneNumber({
        number: `+${value}`,
        isValid: !event.target?.classList.value.includes('invalid-number'),
      }),
    );
  };

  const handlePasswordChange = event => {
    localDispatch(actions.setPassword(event.target.value));
  };

  const togglePasswordVisibility = () => {
    localDispatch(actions.setIsPasswordVisible(!isPasswordVisible));
  };

  const isFormValid = () => {
    return (
      password.match(PasswordRegex) &&
      firstName.length > 2 &&
      lastName.length > 2 &&
      isPhoneValid
    );
  };

  const handleAcceptInvitation = async () => {
    if (isNew && !isFormValid()) {
      return;
    }
    localDispatch(actions.setIsLoading(true));
    const requestBody = {
      firstName,
      lastName,
      password,
      phoneNumber,
      invitationToken: token,
    };
    if (avatarFile != null) {
      const uploadResult = await uploadFileToAWS('avatars', avatarFile);
      if (uploadResult?.location != null) {
        requestBody.avatar = uploadResult.location;
      }
    }
    const response = await dataAPI.acceptClinicInvitation(requestBody);
    if (response.isError) {
      toast.error(textForKey(response.message));
      console.error(response.message);
    } else {
      dispatch(
        handleUserAuthenticated(response.data, () => {
          toast.success(textForKey('invitation_accepted_success'));
          localDispatch(actions.setIsInvitationAccepted(true));
        }),
      );
    }
    setTimeout(() => {
      localDispatch(actions.setIsLoading(false));
    }, 500);
  };

  if (isInvitationAccepted) {
    return <Redirect to={updateLink('/')} />;
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
        {!isNew && (
          <CircularProgress classes={{ root: 'existent-accept-progress' }} />
        )}
        {isNew && (
          <div className='form-root accept-invitation'>
            <div className='form-wrapper'>
              <span className='form-title'>
                {textForKey('Accept invitation')}
              </span>
              <span className='welcome-text'>
                {textForKey('accept invitation message')}
              </span>
              <div className='upload-avatar-container'>
                {avatarFile ? (
                  <Image roundedCircle src={avatarFile} />
                ) : (
                  <IconAvatar />
                )}
                <span style={{ margin: '1rem' }}>
                  {textForKey('JPG or PNG, Max size of 800kb')}
                </span>
                <Form.Group>
                  <input
                    className='custom-file-button'
                    type='file'
                    name='avatar-file'
                    id='avatar-file'
                    accept='.jpg,.jpeg,.png'
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor='avatar-file'>
                    {textForKey('Upload image')}
                  </label>
                </Form.Group>
              </div>
              <Form.Group controlId='lastName'>
                <Form.Label>{textForKey('Last name')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={lastName}
                    type='text'
                    onChange={handleLastNameChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='firstName'>
                <Form.Label>{textForKey('First name')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    value={firstName}
                    type='text'
                    onChange={handleFirstNameChange}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='phoneNumber'>
                <Form.Label>{textForKey('Phone number')}</Form.Label>
                <InputGroup>
                  <PhoneInput
                    onChange={handlePhoneNumberChange}
                    value={phoneNumber}
                    alwaysDefaultMask
                    countryCodeEditable={false}
                    country='md'
                    placeholder='079123456'
                    isValid={(inputNumber, country) => {
                      const phoneNumber = inputNumber.replace(
                        `${country.dialCode}`,
                        '',
                      );
                      return (
                        phoneNumber.length === 0 || phoneNumber.length === 8
                      );
                    }}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group controlId='newPassword'>
                <Form.Label>{textForKey('Enter a new password')}</Form.Label>
                <InputGroup>
                  <Form.Control
                    autoComplete='new-password'
                    value={password}
                    onChange={handlePasswordChange}
                    type={isPasswordVisible ? 'text' : 'password'}
                  />
                  <InputGroup.Append className='password-visibility-append'>
                    <Button
                      onClick={togglePasswordVisibility}
                      variant='outline-primary'
                      className='visibility-toggle-btn'
                    >
                      {isPasswordVisible ? <VisibilityOff /> : <VisibilityOn />}
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
                <Form.Text className='text-muted'>
                  {textForKey('passwordValidationMessage')}
                </Form.Text>
              </Form.Group>
            </div>
            <div className={clsx('footer', !isNew && 'is-new')}>
              <LoadingButton
                isLoading={isLoading}
                disabled={!isFormValid() || isLoading}
                className='positive-button'
                onClick={handleAcceptInvitation}
              >
                {textForKey('Accept invitation')}
              </LoadingButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvitation;
