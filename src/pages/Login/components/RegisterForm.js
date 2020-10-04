import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useHistory } from 'react-router-dom';

import IconAvatar from '../../../assets/icons/iconAvatar';
import LoadingButton from '../../../components/LoadingButton';
import authAPI from '../../../utils/api/authAPI';
import { EmailRegex } from '../../../utils/constants';
import { uploadFileToAWS } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';
import authManager from '../../../utils/settings/authManager';

const RegisterForm = ({ onGoBack }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    phoneNumber: '',
    avatarFile: null,
    isPhoneValid: false,
  });

  const handleFormChange = event => {
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handleAvatarChange = event => {
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, avatarFile: files[0] });
    }
  };

  const handlePhoneChange = (value, _, event) => {
    setData({
      ...data,
      phoneNumber: `+${value}`,
      isPhoneValid: !event.target.classList.value.includes('invalid-number'),
    });
  };

  const submitForm = async () => {
    if (!isFormValid() || isLoading) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    let avatar = null;
    if (data.avatarFile != null) {
      const uploadResult = await uploadFileToAWS('avatars', data.avatarFile);
      avatar = uploadResult?.location;
    }
    const response = await authAPI.register({
      firstName: data.firstName,
      lastName: data.lastName,
      avatar,
      username: data.username,
      password: data.password,
      phoneNumber: data.phoneNumber,
    });
    if (response.isError) {
      console.error(response.message);
      setErrorMessage(response.message);
    } else {
      authManager.setUserToken(response.data.token);
      history.push('/analytics/general');
    }
    setIsLoading(false);
  };

  const isFormValid = () => {
    return (
      data?.firstName?.length > 0 &&
      data.lastName.length > 0 &&
      data.username.match(EmailRegex) &&
      data.password.length >= 8 &&
      data.isPhoneValid
    );
  };

  const avatarSrc =
    data.avatarFile && window.URL.createObjectURL(data.avatarFile);

  return (
    <div className='form-root register-form'>
      <span className='form-title'>{textForKey('Create new account')}</span>
      {errorMessage && (
        <span className='error-text'>{textForKey(errorMessage)}</span>
      )}
      <Form.Group controlId='lastName'>
        <Form.Label>{textForKey('Last name')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={data.lastName}
            type='text'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='firstName'>
        <Form.Label>{textForKey('First name')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={data.firstName}
            type='text'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='username'>
        <Form.Label>{textForKey('Email')}</Form.Label>
        <InputGroup>
          <Form.Control
            isValid={data?.username?.match(EmailRegex)}
            autoComplete='new-email'
            value={data.username}
            type='email'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>{textForKey('Password')}</Form.Label>
        <InputGroup>
          <Form.Control
            autoComplete='new-password'
            value={data.password}
            type='password'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='phoneNumber'>
        <Form.Label>{textForKey('Phone number')}</Form.Label>
        <InputGroup>
          <PhoneInput
            onChange={handlePhoneChange}
            value={data.phoneNumber}
            alwaysDefaultMask
            countryCodeEditable={false}
            country='md'
            placeholder='079123456'
            isValid={(inputNumber, country) => {
              const phoneNumber = inputNumber.replace(
                `${country.dialCode}`,
                '',
              );
              return phoneNumber.length === 0 || phoneNumber.length === 8;
            }}
          />
        </InputGroup>
      </Form.Group>
      <div className='upload-avatar-container'>
        {avatarSrc ? <Image roundedCircle src={avatarSrc} /> : <IconAvatar />}
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
          <label htmlFor='avatar-file'>{textForKey('Upload image')}</label>
        </Form.Group>
      </div>
      <div className='footer'>
        <div
          role='button'
          tabIndex={0}
          className='back-button'
          onClick={onGoBack}
        >
          {textForKey('Already have an account?')}
        </div>
        <LoadingButton
          onClick={submitForm}
          isLoading={isLoading}
          className='positive-button'
          disabled={!isFormValid()}
        >
          {textForKey('Create new account')}
        </LoadingButton>
      </div>
    </div>
  );
};

export default RegisterForm;

RegisterForm.propTypes = {
  onGoBack: PropTypes.func,
};
