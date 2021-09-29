import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import axios from "axios";

import IconAvatar from '../../../icons/iconAvatar';
import { EmailRegex, PasswordRegex } from '../../../../utils/constants';
import uploadFileToAWS from '../../../../../utils/uploadFileToAWS';
import urlToLambda from '../../../../../utils/urlToLambda';
import { textForKey } from '../../../../../utils/localization';
import EasyPlanModal from '../EasyPlanModal';
import styles from './EditProfileModal.module.scss';
import isPhoneInputValid from "../../../../utils/isPhoneInputValid";
import { useRouter } from "next/router";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";

const EditProfileModal = ({ open, currentUser, onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [data, setData] = useState({
    avatarUrl: currentUser?.avatar,
    avatarFile: null,
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
    oldPassword: '',
    isPhoneValid: true,
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setData({ ...data, ...currentUser, email: currentUser?.email });
  }, [currentUser]);

  useEffect(() => {
    const isChanged = data.email !== currentUser?.email;
    if (!isChanged) {
      setData({ ...data, oldPassword: '' });
    }
    setIsEmailChanged(isChanged);
  }, [data.email]);

  const handleLogoChange = event => {
    if (isLoading) return;
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, avatarFile: files[0] });
    }
  };

  const handleFormChange = event => {
    if (isLoading) return;
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handlePhoneChange = (value, country, event) => {
    if (isLoading) return;
    setData({
      ...data,
      phoneNumber: `+${value}`,
      isPhoneValid: isPhoneNumberValid(value, country) && !event.target?.classList.value.includes('invalid-number'),
    });
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      let avatar = data.avatarUrl;
      if (data.avatarFile != null) {
        const uploadResult = await uploadFileToAWS('avatars', data.avatarFile);
        avatar = uploadResult?.location;
      }
      const requestBody = {
        avatar,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.email,
        oldPassword: data.oldPassword,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      await axios.put(`/api/auth/update-account`, requestBody);
      toast.success(textForKey('Saved successfully'));
      onClose();
      await router.replace(router.asPath);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    const isPasswordValid =
      data.password.length === 0 ||
      (data.oldPassword.length > 0 &&
        data.password.match(PasswordRegex) &&
        data.confirmPassword === data.password);
    const isEmailValid =
      (data.email == null ||
        data.email.length === 0 ||
        data.email.match(EmailRegex)) &&
      (!isEmailChanged || data.oldPassword?.length > 0);
    const isPhoneNumberValid =
      data.phoneNumber == null ||
      data.phoneNumber.length === 0 ||
      data.isPhoneValid;
    const isNameValid = data.firstName?.length > 3;
    return isNameValid && isPhoneNumberValid && isEmailValid && isPasswordValid;
  };

  const avatarSrc =
    (data.avatarFile && window.URL.createObjectURL(data.avatarFile)) ||
    (data.avatarUrl ? urlToLambda(data.avatarUrl, 64) : null);

  return (
    <EasyPlanModal
      title={textForKey('Account settings')}
      open={open}
      className={styles['edit-profile-modal']}
      onClose={onClose}
      isPositiveDisabled={!isFormValid()}
      onPositiveClick={submitForm}
      isPositiveLoading={isLoading}
    >
      <div className={styles['modal-account-settings']}>
        <div className={styles['upload-avatar-container']}>
          {avatarSrc ? <Image roundedCircle src={avatarSrc} /> : <IconAvatar />}
          <span style={{ margin: '1rem' }} className={styles['info-text']}>
            {textForKey('JPG or PNG, Max size of 800kb')}
          </span>
          <Form.Group>
            <input
              className={styles['custom-file-button']}
              type='file'
              name='avatar-file'
              id='avatar-file'
              accept='.jpg,.jpeg,.png'
              onChange={handleLogoChange}
            />
            <label htmlFor='avatar-file'>{textForKey('Upload image')}</label>
          </Form.Group>
        </div>
        <Form.Group controlId='lastName'>
          <Form.Label>{textForKey('Last name')}</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              onChange={handleFormChange}
              value={data.lastName || ''}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='firstName'>
          <Form.Label>{textForKey('First name')}</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              onChange={handleFormChange}
              value={data.firstName || ''}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control
              isValid={data.email?.match(EmailRegex)}
              type='text'
              onChange={handleFormChange}
              value={data.email || ''}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='phoneNumber'>
          <Form.Label>{textForKey('Phone number')}</Form.Label>
          <InputGroup>
            <PhoneInput
              onChange={handlePhoneChange}
              value={data.phoneNumber || ''}
              alwaysDefaultMask
              countryCodeEditable={false}
              country='md'
              isValid={isPhoneInputValid}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='oldPassword'>
          <Form.Label>{textForKey('Current password')}</Form.Label>
          <InputGroup>
            <Form.Control
              autoComplete='new-password'
              value={data.oldPassword || ''}
              type='password'
              onChange={handleFormChange}
            />
            {isEmailChanged && (
              <Form.Text className={styles['text-muted']}>
                {textForKey('Current password is required')}
              </Form.Text>
            )}
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>{textForKey('New password')}</Form.Label>
          <InputGroup>
            <Form.Control
              autoComplete='new-password'
              value={data.password || ''}
              isValid={data.password.match(PasswordRegex)}
              isInvalid={
                data.password.length > 0 && !data.password.match(PasswordRegex)
              }
              type='password'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>{textForKey('Confirm new password')}</Form.Label>
          <InputGroup>
            <Form.Control
              isInvalid={
                data.confirmPassword.length > 0 &&
                data.confirmPassword !== data.password
              }
              isValid={
                data.password.length > 0 &&
                data.confirmPassword === data.password
              }
              autoComplete='new-password'
              value={data.confirmPassword || ''}
              type='password'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
      </div>
    </EasyPlanModal>
  );
};

export default EditProfileModal;

EditProfileModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
