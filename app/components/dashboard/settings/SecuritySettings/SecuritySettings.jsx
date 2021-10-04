import React, { useState } from 'react';
import { useRouter } from "next/router";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { toast } from 'react-toastify';

import IconSuccess from '../../../icons/iconSuccess';
import LoadingButton from '../../../common/LoadingButton';
import { textForKey } from '../../../../../utils/localization';
import { updateUserAccount } from "../../../../../middleware/api/auth";
import styles from './SecuritySettings.module.scss';
import EASTextField from "../../../common/EASTextField";

const SecuritySettings = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

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

    setIsLoading(true);
    try {
      const requestBody = {
        ...data,
        avatar: currentUser.avatar,
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

  return (
    <div className={styles['security-settings']}>
      <span className={styles['form-title']}>{textForKey('Security settings')}</span>
      <EASTextField
        type="password"
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Current password')}
        value={data.oldPassword || ''}
        onChange={(value) => handleFormChange('oldPassword', value)}
      />

      <EASTextField
        type="password"
        containerClass={styles.simpleField}
        fieldLabel={textForKey('New password')}
        value={data.password || ''}
        onChange={(value) => handleFormChange('password', value)}
      />

      <EASTextField
        type="password"
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Confirm new password')}
        value={data.confirmPassword || ''}
        error={
          data.confirmPassword.length > 0 &&
          data.confirmPassword !== data.password
        }
        onChange={(value) => handleFormChange('confirmPassword', value)}
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

export default SecuritySettings;
