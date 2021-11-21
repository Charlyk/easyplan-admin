import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import EASTextField from 'app/components/common/EASTextField';
import LoadingButton from 'app/components/common/LoadingButton';
import IconSuccess from 'app/components/icons/iconSuccess';
import NotificationsContext from 'app/context/notificationsContext';
import { HeaderKeys, PasswordRegex } from 'app/utils/constants';
import { textForKey } from 'app/utils/localization';
import { updateUserAccount } from 'middleware/api/auth';
import styles from './SecuritySettings.module.scss';

const SecuritySettings = ({ currentClinic, authToken }) => {
  const router = useRouter();
  const toast = useContext(NotificationsContext);
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    try {
      await updateUserAccount(data, null, {
        [HeaderKeys.authorization]: authToken,
        [HeaderKeys.clinicId]: currentClinic.id,
        [HeaderKeys.subdomain]: currentClinic.domainName,
      });
      await router.replace(router.asPath);
      toast.success(textForKey('Saved successfully'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['security-settings']}>
      <span className={styles['form-title']}>
        {textForKey('Security settings')}
      </span>
      <EASTextField
        type='password'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Current password')}
        value={data.oldPassword || ''}
        onChange={(value) => handleFormChange('oldPassword', value)}
      />

      <EASTextField
        type='password'
        containerClass={styles.simpleField}
        error={!isNewPasswordValid}
        helperText={textForKey('passwordvalidationmessage')}
        fieldLabel={textForKey('New password')}
        value={data.password || ''}
        onChange={(value) => handleFormChange('password', value)}
      />

      <EASTextField
        type='password'
        containerClass={styles.simpleField}
        fieldLabel={textForKey('Confirm new password')}
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
        {textForKey('Save')}
        {!isLoading && <IconSuccess />}
      </LoadingButton>
    </div>
  );
};

export default SecuritySettings;
