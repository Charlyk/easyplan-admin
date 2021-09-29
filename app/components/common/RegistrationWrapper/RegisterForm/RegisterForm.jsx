import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from "clsx";

import { EmailRegex, PasswordRegex } from '../../../../utils/constants';
import { textForKey } from '../../../../../utils/localization';
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";
import LoadingButton from '../../LoadingButton';
import UploadAvatar from "../../UploadAvatar";
import EASTextField from "../../EASTextField";
import EASPhoneInput from "../../EASPhoneInput";
import styles from './RegisterForm.module.scss';
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import VisibilityOn from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";

const RegisterForm = ({ errorMessage, isLoading, isMobile, onSubmit, onGoBack }) => {
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

  const handleAvatarChange = file => {
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
      isPhoneValid: isPhoneNumberValid(value, country) && !event.target.classList.value.includes('invalid-number'),
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

  return (
    <div
      className={clsx('form-root', styles['register-form'])}
      style={{
        padding: isMobile ? '2rem' : '3rem',
        width: isMobile ? '90%' : '70%',
      }}
    >
      <span className='form-title'>{textForKey('Create new account')}</span>
      {errorMessage && (
        <span className='error-text'>{textForKey(errorMessage)}</span>
      )}
      <form>
        <UploadAvatar
          currentAvatar={data.avatarFile}
          onChange={handleAvatarChange}
        />

        <EASTextField
          type="text"
          containerClass={styles.textField}
          value={data.lastName}
          onChange={handleLastNameChange}
          fieldLabel={textForKey('Last name')}
        />

        <EASTextField
          type="text"
          containerClass={styles.textField}
          value={data.firstName}
          onChange={handleFirstNameChange}
          fieldLabel={textForKey('First name')}
        />

        <EASTextField
          type="email"
          containerClass={styles.textField}
          value={data.username}
          onChange={handleEmailChange}
          fieldLabel={textForKey('Email')}
        />

        <EASTextField
          type={isPasswordVisible ? 'text' : 'password'}
          containerClass={styles.textField}
          value={data.password}
          onChange={handlePasswordChange}
          fieldLabel={textForKey('Password')}
          endAdornment={
            <IconButton
              onClick={togglePasswordVisibility}
              className={styles.visibilityToggleBtn}
            >
              {isPasswordVisible ? <VisibilityOff/> : <VisibilityOn/>}
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
          <div
            role='button'
            tabIndex={0}
            className='back-button'
            onClick={onGoBack}
          >
            {textForKey('Already have an account')}?
          </div>
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            className='positive-button'
            disabled={!isFormValid()}
            style={{
              width: isMobile ? '6.5rem' : 'unset',
              minWidth: isMobile ? 'unset' : '8rem'
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
