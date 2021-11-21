import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import EASPhoneInput from 'app/components/common/EASPhoneInput';
import EASTextField from 'app/components/common/EASTextField';
import UploadAvatar from 'app/components/common/UploadAvatar';
import { EmailRegex, HeaderKeys, PasswordRegex } from 'app/utils/constants';
import isPhoneNumberValid from 'app/utils/isPhoneNumberValid';
import { textForKey } from 'app/utils/localization';
import urlToLambda from 'app/utils/urlToLambda';
import { updateUserAccount } from 'middleware/api/auth';
import EASModal from '../EASModal';
import styles from './EditProfileModal.module.scss';

const EditProfileModal = ({
  open,
  currentUser,
  currentClinic,
  authToken,
  onClose,
}) => {
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
  const avatarSrc = data.avatarUrl ? urlToLambda(data.avatarUrl, 64) : null;

  const isPasswordValid =
    data.password.length === 0 || data.password.match(PasswordRegex);
  const isConfirmPasswordValid =
    data.password.length === 0 || data.confirmPassword === data.password;
  const isEmailValid = data.email.length === 0 || data.email.match(EmailRegex);

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

  const handleLogoChange = (file) => {
    if (isLoading) return;
    if (file != null) {
      setData({ ...data, avatarFile: file });
    }
  };

  const handleFormChange = (fieldId) => (newValue) => {
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

  const submitForm = async (event) => {
    event?.preventDefault();
    setIsLoading(true);
    try {
      const requestBody = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.email,
        oldPassword: data.oldPassword,
        phoneNumber: data.phoneNumber,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      await updateUserAccount(requestBody, data.avatarUrl, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
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

  return (
    <EASModal
      title={textForKey('Account settings')}
      open={open}
      className={styles.editProfileModal}
      paperClass={styles.modalPaper}
      onClose={onClose}
      isPositiveDisabled={!isFormValid()}
      onPrimaryClick={submitForm}
      isPositiveLoading={isLoading}
    >
      <form className={styles.modalAccountSettings} onSubmit={submitForm}>
        <UploadAvatar
          currentAvatar={data.avatarFile ?? avatarSrc}
          onChange={handleLogoChange}
        />

        <EASTextField
          type='text'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Last name')}
          value={data.lastName ?? ''}
          onChange={handleFormChange('lastName')}
        />

        <EASTextField
          type='text'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('First name')}
          value={data.firstName ?? ''}
          onChange={handleFormChange('firstName')}
        />

        <EASTextField
          type='email'
          error={!isEmailValid}
          helperText={isEmailValid ? null : textForKey('email_invalid_message')}
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Email')}
          value={data.email ?? ''}
          onChange={handleFormChange('email')}
        />

        <EASPhoneInput
          rootClass={styles.simpleField}
          fieldLabel={textForKey('Phone number')}
          onChange={handlePhoneChange}
          value={data.phoneNumber ?? ''}
          country='md'
        />

        <EASTextField
          type='password'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Current password')}
          value={data.oldPassword ?? ''}
          onChange={handleFormChange('oldPassword')}
          helperText={
            isEmailChanged ? textForKey('Current password is required') : null
          }
        />

        <EASTextField
          type='password'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('new password')}
          value={data.password ?? ''}
          error={!isPasswordValid}
          onChange={handleFormChange('password')}
          helperText={
            !isPasswordValid ? textForKey('passwordvalidationmessage') : null
          }
        />

        <EASTextField
          type='password'
          containerClass={styles.simpleField}
          fieldLabel={textForKey('Confirm new password')}
          value={data.confirmPassword ?? ''}
          error={!isConfirmPasswordValid}
          onChange={handleFormChange('confirmPassword')}
          helperText={
            !isConfirmPasswordValid ? textForKey('passwords_not_equal') : null
          }
        />
      </form>
    </EASModal>
  );
};

export default EditProfileModal;

EditProfileModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
