import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOn from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import UploadAvatar from 'app/components/common/UploadAvatar';
import { EmailRegex, PasswordRegex } from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import { textForKey } from 'app/utils/localization';
import styles from './RegisterForm.module.scss';

const RegisterForm = ({
  errorMessage,
  isLoading,
  isMobile,
  onSubmit,
  onGoBack,
}) => {
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
  const isPasswordFieldValid =
    data.password.length === 0 || data.password.match(PasswordRegex);
  const isEmailFieldValid =
    data.username.length === 0 || data.username.match(EmailRegex);

  const handleLastNameChange = (newValue) => {
    setData({ ...data, lastName: newValue });
  };

  const handleFirstNameChange = (newValue) => {
    setData({ ...data, firstName: newValue });
  };

  const handleEmailChange = (newValue) => {
    setData({ ...data, username: newValue });
  };

  const handlePasswordChange = (newValue) => {
    setData({ ...data, password: newValue });
  };

  const handleAvatarChange = (file) => {
    if (file != null) {
      setData({ ...data, avatarFile: file });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePhoneChange = (value, country, event) => {
    setData({
      ...data,
      phoneNumber: `+${value}`,
      isPhoneValid:
        isPhoneNumberValid(value, country) &&
        !event.target.classList.value.includes('invalid-number'),
    });
  };

  const submitForm = async (event) => {
    event?.preventDefault();
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

  return (
    <div
      className={clsx('form-root', styles['register-form'])}
      style={{
        padding: isMobile ? '1rem' : '2rem',
        width: isMobile ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
      }}
    >
      <span className='form-title'>{textForKey('Create new account')}</span>
      {errorMessage && (
        <span className='error-text'>{textForKey(errorMessage)}</span>
      )}
      <form onSubmit={submitForm}>
        <UploadAvatar
          currentAvatar={data.avatarFile}
          onChange={handleAvatarChange}
        />

        <EASTextField
          id='firstName'
          type='text'
          containerClass={styles.textField}
          value={data.lastName}
          onChange={handleLastNameChange}
          fieldLabel={textForKey('Last name')}
        />

        <EASTextField
          id='lastName'
          type='text'
          containerClass={styles.textField}
          value={data.firstName}
          onChange={handleFirstNameChange}
          fieldLabel={textForKey('First name')}
        />

        <EASTextField
          id='emailField'
          disableAutoFill
          type='email'
          error={!isEmailFieldValid}
          helperText={
            isEmailFieldValid ? null : textForKey('email_invalid_message')
          }
          containerClass={styles.textField}
          value={data.username}
          onChange={handleEmailChange}
          fieldLabel={textForKey('Email')}
        />

        <EASTextField
          if='passwordField'
          disableAutoFill
          type={isPasswordVisible ? 'text' : 'password'}
          containerClass={styles.textField}
          value={data.password}
          error={!isPasswordFieldValid}
          onChange={handlePasswordChange}
          helperText={textForKey('passwordvalidationmessage')}
          fieldLabel={textForKey('Password')}
          endAdornment={
            <IconButton
              onClick={togglePasswordVisibility}
              className={styles.visibilityToggleBtn}
            >
              {isPasswordVisible ? <VisibilityOff /> : <VisibilityOn />}
            </IconButton>
          }
        />

        <EASPhoneInput
          fieldLabel={textForKey('Phone number')}
          rootClass={styles.textField}
          value={data.phoneNumber}
          onChange={handlePhoneChange}
        />

        <div className='footer'>
          <Box className='back-button' onClick={onGoBack}>
            {textForKey('Already have an account')}?
          </Box>
          <LoadingButton
            type='submit'
            isLoading={isLoading}
            className='positive-button'
            disabled={!isFormValid()}
            style={{
              width: isMobile ? '6.5rem' : 'unset',
              minWidth: isMobile ? 'unset' : '8rem',
            }}
            onClick={submitForm}
          >
            {textForKey('Next')}
          </LoadingButton>
        </div>
      </form>
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
