import React, { useEffect, useState } from 'react';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import UploadAvatar from 'app/components/common/UploadAvatar';
import IconSuccess from 'app/components/icons/iconSuccess';
import { EmailRegex } from 'app/utils/constants';
import imageToBase64 from 'app/utils/imageToBase64';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import {
  currentUserSelector,
  isUpdatingProfileSelector,
  isEmailChangedSelector,
} from 'redux/selectors/appDataSelector';
import {
  updateUserProfile,
  updateIsEmailChanged,
} from 'redux/slices/appDataSlice';
import styles from './AccountSettings.module.scss';

const AccountSettings = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const currentUser = useSelector(currentUserSelector);
  const isLoading = useSelector(isUpdatingProfileSelector);
  const isEmailChanged = useSelector(isEmailChangedSelector);
  const [data, setData] = useState({
    avatarUrl: currentUser?.avatar,
    avatarFile: null,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    phoneNumber: currentUser.phoneNumber,
    oldPassword: null,
    isPhoneValid: true,
  });
  const isEmailValid = data.email.length === 0 || data.email.match(EmailRegex);

  useEffect(() => {
    setData({ ...data, ...currentUser, email: currentUser?.email });
  }, []);

  useEffect(() => {
    const isChanged = data.email !== currentUser.email;
    if (!isChanged) {
      setData({ ...data, oldPassword: null });
    }
    dispatch(updateIsEmailChanged(isChanged));
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
      isPhoneValid:
        isPhoneNumberValid(value, country) &&
        !event.target?.classList.value.includes('invalid-number'),
    });
  };

  const submitForm = async () => {
    const avatar =
      data.avatarFile != null ? await imageToBase64(data.avatarFile) : null;

    const requestBody = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.email,
      oldPassword: data.oldPassword,
      phoneNumber: data.phoneNumber,
      avatar,
    };
    dispatch(updateUserProfile(requestBody));
    setData((prevState) => ({ ...prevState, oldPassword: '' }));
  };

  const isFormValid = () => {
    const isFirstNameValid = data.firstName?.length > 3;

    const isPhoneNumberValid =
      data.phoneNumber == null ||
      data.phoneNumber.length === 0 ||
      data.isPhoneValid;

    const isEmailValid =
      data.email == null ||
      data.email.length === 0 ||
      data.email.match(EmailRegex);

    const isPasswordValid =
      data.oldPassword?.length > 0 && data.oldPassword !== null;

    return isEmailChanged
      ? isFirstNameValid &&
          isPhoneNumberValid &&
          isEmailValid &&
          isPasswordValid
      : isFirstNameValid && isPhoneNumberValid && isEmailValid;
  };

  return (
    <div className={styles['account-settings']}>
      <span className={styles['form-title']}>
        {textForKey('account settings')}
      </span>
      <UploadAvatar
        currentAvatar={data.avatarFile || data.avatarUrl}
        onChange={handleLogoChange}
      />
      <EASTextField
        type='text'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('last name')}
        value={data.lastName || ''}
        onChange={(value) => handleFormChange('lastName', value)}
      />

      <EASTextField
        type='text'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('first name')}
        value={data.firstName || ''}
        onChange={(value) => handleFormChange('firstName', value)}
      />

      <EASTextField
        type='email'
        containerClass={styles.simpleField}
        error={!isEmailValid}
        helperText={isEmailValid ? null : textForKey('email_invalid_message')}
        fieldLabel={textForKey('email')}
        value={data.email || ''}
        onChange={(value) => handleFormChange('email', value)}
      />

      {isEmailChanged && (
        <EASTextField
          type='password'
          autoComplete='new-password'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('current password')}
          value={data.oldPassword || ''}
          onChange={(value) => handleFormChange('oldPassword', value)}
        />
      )}

      <EASPhoneInput
        rootClass={styles.simpleField}
        fieldLabel={textForKey('phone number')}
        value={data.phoneNumber || ''}
        onChange={handlePhoneChange}
      />

      <LoadingButton
        onClick={submitForm}
        className={styles.saveButton}
        isLoading={isLoading}
        disabled={isLoading || !isFormValid()}
      >
        {textForKey('save')}
        {!isLoading && <IconSuccess />}
      </LoadingButton>
    </div>
  );
};

export default AccountSettings;
