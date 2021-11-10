import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Typography from "@material-ui/core/Typography";

import { textForKey } from '../../../utils/localization';
import { isDev } from "../../../../eas.config";
import { wrapper } from "../../../../store";
import { requestResetUserPassword } from "../../../../middleware/api/auth";
import useIsMobileDevice from "../../../utils/hooks/useIsMobileDevice";
import { PasswordRegex } from '../../../utils/constants';
import LoadingButton from '../LoadingButton';
import EASTextField from "../EASTextField";
import styles from './ResetPasswordForm.module.scss';
import urlToLambda from "../../../utils/urlToLambda";

const ResetPasswordForm = ({ token }) => {
  const isMobileDevice = useIsMobileDevice();
  const [state, setState] = useState({
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    errorMessage: null,
    redirectUser: false,
  });

  const handleNewPasswordChange = (newValue) => {
    setState({ ...state, newPassword: newValue });
  }

  const handleConfirmPasswordChange = (newValue) => {
    setState({ ...state, confirmPassword: newValue });
  }

  const handleSavePassword = useCallback(async () => {
    if (!isFormValid()) {
      return;
    }
    setState({ ...state, isLoading: true });
    try {
      await requestResetUserPassword({
        newPassword: state.newPassword,
        resetToken: token,
      })
      toast.success(textForKey('Saved successfully'));
      window.location = `/login`;
    } catch (error) {
      toast.error(error.message);
      setState({ ...state, errorMessage: error.message, isLoading: false });
    }
  }, [token, state]);

  const isFormValid = () => {
    return (
      state.newPassword.match(PasswordRegex) &&
      state.confirmPassword === state.newPassword
    );
  };

  const isConfirmError = state.confirmPassword.length > 0 && state.confirmPassword !== state.newPassword;

  return (
    <div
      className={styles.generalPage}
    >
      {isDev && <Typography className='develop-indicator'>Dev</Typography>}
      {!isMobileDevice && (
        <div className={styles.logoContainer}>
          <img
            src={urlToLambda('settings/easyplan-logo.svg')}
            alt='EasyPlan'
          />
        </div>
      )}
      <div
        className={styles.formContainer}
        style={{
          width: isMobileDevice ? '100%' : '60%',
          backgroundColor: isMobileDevice ? '#34344E' : '#E5E5E5',
        }}
      >
        {isMobileDevice && (
          <img
            src={urlToLambda('settings/easyplan-logo.svg')}
            alt='EasyPlan'
          />
        )}
        <div
          className={styles.formRoot}
          style={{
            width: isMobileDevice ? 'calc(90% - 2rem)' : 'calc(70% - 4rem)',
            padding: isMobileDevice ? '1rem' : '2rem',
          }}
        >
          <div className={styles.formWrapper}>
            <Typography className={styles.formTitle}>
              {textForKey('Create new password')}
            </Typography>
            <Typography className={styles.welcomeText}>
              {textForKey('change password message')}
            </Typography>
            <form autoComplete="off" onSubmit={handleSavePassword}>
              <EASTextField
                type="password"
                containerClass={styles.passwordField}
                value={state.newPassword}
                onChange={handleNewPasswordChange}
                fieldLabel={textForKey('Enter a new password')}
                helperText={textForKey('passwordValidationMessage')}
                error={
                  state.newPassword.length > 0 &&
                  !state.newPassword.match(PasswordRegex)
                }
              />
              <EASTextField
                type="password"
                containerClass={styles.passwordField}
                fieldLabel={textForKey('Confirm password')}
                onChange={handleConfirmPasswordChange}
                value={state.confirmPassword}
                helperText={isConfirmError ? textForKey('passwords_not_equal') : null}
                error={isConfirmError}
              />
            </form>
          </div>
          <div className={styles.footer}>
            <LoadingButton
              onClick={handleSavePassword}
              isLoading={state.isLoading}
              disabled={!isFormValid() || state.isLoading}
              className='positive-button'
            >
              {textForKey('Save')}
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default wrapper.withRedux(ResetPasswordForm);
