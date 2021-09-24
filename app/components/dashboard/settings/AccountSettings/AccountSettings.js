import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

import IconSuccess from '../../../icons/iconSuccess';
import LoadingButton from '../../../../../components/common/LoadingButton';
import { EmailRegex } from '../../../../utils/constants';
import uploadFileToAWS from '../../../../../utils/uploadFileToAWS';
import { textForKey } from '../../../../../utils/localization';
import { updateUserAccount } from "../../../../../middleware/api/auth";
import isPhoneInputValid from "../../../../utils/isPhoneInputValid";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";
import UploadAvatar from "../../../common/UploadAvatar";
import styles from './AccountSettings.module.scss'

const AccountSettings = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [data, setData] = useState({
    avatarUrl: currentUser.avatar,
    avatarFile: null,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phoneNumber: currentUser.phoneNumber,
    oldPassword: null,
    isPhoneValid: true,
  });

  useEffect(() => {
    setData({ ...data, ...currentUser, email: currentUser?.email });
  }, []);

  useEffect(() => {
    const isChanged = data.email !== currentUser.email;
    if (!isChanged) {
      setData({ ...data, oldPassword: null });
    }
    setIsEmailChanged(isChanged);
  }, [data.email]);

  const handleLogoChange = (file) => {
    if (isLoading) return;
    if (file != null) {
      setData({ ...data, avatarFile: file });
    }
  };

  const handleFormChange = (event) => {
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
      };

      await updateUserAccount(requestBody);
      router.replace(router.asPath);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      data.firstName?.length > 3 &&
      (data.phoneNumber == null ||
        data.phoneNumber.length === 0 ||
        data.isPhoneValid) &&
      (data.email == null ||
        data.email.length === 0 ||
        data.email.match(EmailRegex))
    );
  };

  return (
    <div className={styles['account-settings']}>
      <span className={styles['form-title']}>{textForKey('Account settings')}</span>
      <UploadAvatar
        currentAvatar={data.avatarFile || data.avatarUrl}
        onChange={handleLogoChange}
      />
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
      {isEmailChanged && (
        <Form.Group controlId='oldPassword'>
          <Form.Label>{textForKey('Current password')}</Form.Label>
          <InputGroup>
            <Form.Control
              autoComplete='new-password'
              value={data.oldPassword || ''}
              type='password'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
      )}
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
      <LoadingButton
        onClick={submitForm}
        className='positive-button'
        isLoading={isLoading}
        disabled={isLoading || !isFormValid()}
      >
        {textForKey('Save')}
        {!isLoading && <IconSuccess />}
      </LoadingButton>
    </div>
  );
};

export default AccountSettings;