import React, { useState } from 'react';

import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PropTypes from 'prop-types';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { Redirect } from 'react-router-dom';

import IconAvatar from '../icons/iconAvatar';
import LoadingButton from '../LoadingButton';
import { EmailRegex, PasswordRegex } from '../../utils/constants';
import {
  updateLink,
} from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';
import authManager from '../../utils/settings/authManager';
import styles from '../../styles/RegisterForm.module.scss';
import clsx from "clsx";

const RegisterForm = ({ errorMessage, isLoading, onSubmit, onGoBack }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
    let controlId = event.target.id;
    if (controlId === 'newPassword') {
      controlId = 'password';
    }
    setData({
      ...data,
      [controlId]: event.target.value,
    });
  };

  const handleAvatarChange = event => {
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, avatarFile: files[0] });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
    onSubmit(data);
  };

  const isFormValid = () => {
    return (
      data?.firstName?.length > 0 &&
      data.lastName.length > 0 &&
      data.username.match(EmailRegex) &&
      data.password.match(PasswordRegex) &&
      data.isPhoneValid
    );
  };

  if (authManager.isLoggedIn()) {
    return <Redirect to={updateLink('/')} />;
  }

  const avatarSrc =
    data.avatarFile && window.URL.createObjectURL(data.avatarFile);

  return (
    <div className={clsx('form-root', styles['register-form'])}>
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
      <Form.Group controlId='newPassword'>
        <Form.Label>{textForKey('Password')}</Form.Label>
        <InputGroup>
          <Form.Control
            autoComplete='new-password'
            value={data.password}
            type={isPasswordVisible ? 'text' : 'password'}
            onChange={handleFormChange}
          />
          <InputGroup.Append className={styles['password-visibility-append']}>
            <Button
              onClick={togglePasswordVisibility}
              variant='outline-primary'
              className={styles['visibility-toggle-btn']}
            >
              {isPasswordVisible ? <VisibilityOff /> : <VisibilityOn />}
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <Form.Text className={styles['text-muted']}>
          {textForKey('passwordValidationMessage')}
        </Form.Text>
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
          {textForKey('Already have an account')}?
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
  errorMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  onGoBack: PropTypes.func,
};
