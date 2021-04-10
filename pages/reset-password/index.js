import React, { useCallback, useState } from 'react';

import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import LoadingButton from '../../components/common/LoadingButton';
import { JwtRegex, PasswordRegex } from '../../utils/constants';
import { textForKey } from '../../utils/localization';
import axios from "axios";
import clsx from "clsx";
import styles from '../../styles/auth/ResetPasswordForm.module.scss';
import { wrapper } from "../../store";

const ResetPasswordForm = ({ token }) => {
  const [state, setState] = useState({
    newPassword: '',
    confirmPassword: '',
    isLoading: false,
    errorMessage: null,
    redirectUser: false,
  });

  const handleFormChange = event => {
    setState({
      ...state,
      [event.target.id]: event.target.value,
    });
  };

  const handleSavePassword = useCallback(async () => {
    if (!isFormValid()) {
      return;
    }
    setState({ ...state, isLoading: true });
    try {
      await axios.put(`/api/auth/reset-password`, {
        newPassword: state.newPassword,
        resetToken: token,
      });
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

  return (
    <div className={styles['general-page']}>
      <div className={styles['logo-container']}>
        <img
          src='https://easyplan-pro-files.s3.eu-central-1.amazonaws.com/settings/easyplan-logo.svg'
          alt='EasyPlan'
        />
      </div>
      <div className={styles['form-container']}>
        <div className={clsx(styles['form-root'], styles['accept-invitation'])}>
          <div className={styles['form-wrapper']}>
            <span className={styles['form-title']}>
              {textForKey('Create new password')}
            </span>
            <span className={styles['welcome-text']}>
              {textForKey('change password message')}
            </span>
            <Form.Group controlId='newPassword'>
              <Form.Label>{textForKey('Enter a new password')}</Form.Label>
              <InputGroup>
                <Form.Control
                  isInvalid={
                    state.newPassword.length > 0 &&
                    !state.newPassword.match(PasswordRegex)
                  }
                  autoComplete='new-password'
                  value={state.newPassword}
                  onChange={handleFormChange}
                  type='password'
                />
                <Form.Text className='text-muted'>
                  {textForKey('passwordValidationMessage')}
                </Form.Text>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId='confirmPassword'>
              <Form.Label>{textForKey('Confirm password')}</Form.Label>
              <InputGroup>
                <Form.Control
                  autoComplete='new-password'
                  isInvalid={
                    state.confirmPassword.length > 0 &&
                    state.confirmPassword !== state.newPassword
                  }
                  value={state.confirmPassword}
                  onChange={handleFormChange}
                  type='password'
                />
              </InputGroup>
            </Form.Group>
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

export const getServerSideProps = async ({ res, query }) => {
  const { token } = query;

  if (!token.match(JwtRegex)) {
    res.writeHead(302, { Location: `/login` });
    res.end();
    return { props: { token } };
  }

  return {
    props: {
      token
    }
  }
}

export default wrapper.withRedux(ResetPasswordForm);
