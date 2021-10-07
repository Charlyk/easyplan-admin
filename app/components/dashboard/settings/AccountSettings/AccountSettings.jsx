import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

import IconSuccess from '../../../icons/iconSuccess';
import LoadingButton from '../../../common/LoadingButton';
import { EmailRegex } from '../../../../utils/constants';
import uploadFileToAWS from '../../../../../utils/uploadFileToAWS';
import { textForKey } from '../../../../../utils/localization';
import { updateUserAccount } from "../../../../../middleware/api/auth";
import isPhoneNumberValid from "../../../../utils/isPhoneNumberValid";
import UploadAvatar from "../../../common/UploadAvatar";
import EASTextField from "../../../common/EASTextField";
import EASPhoneInput from "../../../common/EASPhoneInput";
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

  const handleFormChange = (fieldId, newValue) => {
    if (isLoading) return;
    setData({
      ...data,
      [fieldId]: newValue,
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
      <EASTextField
        type="text"
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Last name')}
        value={data.lastName || ''}
        onChange={(value) => handleFormChange('lastName', value)}
      />

      <EASTextField
        type="text"
        containerClass={styles.simpleField}
        fieldLabel={textForKey('First name')}
        value={data.firstName || ''}
        onChange={(value) => handleFormChange('firstName', value)}
      />

      <EASTextField
        type="email"
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Email')}
        value={data.email || ''}
        onChange={(value) => handleFormChange('email', value)}
      />

      {isEmailChanged && (
        <EASTextField
          type="password"
          autoComplete='new-password'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Current password')}
          value={data.oldPassword || ''}
          onChange={(value) => handleFormChange('oldPassword', value)}
        />
      )}

      <EASPhoneInput
        rootClass={styles.simpleField}
        fieldLabel={textForKey('Phone number')}
        value={data.phoneNumber || ''}
        onChange={handlePhoneChange}
      />

      <LoadingButton
        onClick={submitForm}
        className={styles.saveButton}
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
