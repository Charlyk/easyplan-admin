import React, { useState } from 'react';
import { useTranslate } from 'react-polyglot';
import { useDispatch, useSelector } from 'react-redux';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import IconSuccess from 'app/components/icons/iconSuccess';
import { PasswordRegex } from 'app/utils/constants';
import { isUpdatingProfileSelector } from 'redux/selectors/appDataSelector';
import { updateUserProfile } from 'redux/slices/appDataSlice';
import styles from './SecuritySettings.module.scss';

const SecuritySettings = () => {
  const textForKey = useTranslate();
  const dispatch = useDispatch();
  const isLoading = useSelector(isUpdatingProfileSelector);
  const [data, setData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

  const isNewPasswordValid =
    data.password.length === 0 || data.password.match(PasswordRegex);
  const isConfirmPasswordValid =
    data.confirmPassword.length === 0 || data.confirmPassword === data.password;

  const handleFormChange = (fieldId, newValue) => {
    setData({
      ...data,
      [fieldId]: newValue,
    });
  };

  const isFormValid = () => {
    return (
      data.oldPassword.length >= 8 &&
      data.password.length >= 8 &&
      data.confirmPassword === data.password
    );
  };

  const submitForm = async () => {
    if (!isFormValid()) return;
    dispatch(updateUserProfile(data));
  };

  return (
    <div className={styles['security-settings']}>
      <span className={styles['form-title']}>
        {textForKey('security settings')}
      </span>
      <EASTextField
        type='password'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('current password')}
        value={data.oldPassword || ''}
        onChange={(value) => handleFormChange('oldPassword', value)}
      />

      <EASTextField
        type='password'
        containerClass={styles.simpleField}
        error={!isNewPasswordValid}
        helperText={textForKey('passwordvalidationmessage')}
        fieldLabel={textForKey('new password')}
        value={data.password || ''}
        onChange={(value) => handleFormChange('password', value)}
      />

      <EASTextField
        type='password'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('confirm new password')}
        value={data.confirmPassword || ''}
        error={!isConfirmPasswordValid}
        helperText={
          isConfirmPasswordValid ? null : textForKey('passwords_not_equal')
        }
        onChange={(value) => handleFormChange('confirmPassword', value)}
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

export default SecuritySettings;
