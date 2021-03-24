import React, { useState } from 'react';

import { Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import IconSuccess from '../../icons/iconSuccess';
import LoadingButton from '../../common/LoadingButton';
import { textForKey } from '../../../utils/localization';
import styles from '../../../styles/SecuritySettings.module.scss';
import axios from "axios";
import { baseAppUrl } from "../../../eas.config";
import { useRouter } from "next/router";
import { updateUserAccount } from "../../../middleware/api/auth";

const SecuritySettings = ({ currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });

  const handleFormChange = (event) => {
    setData({
      ...data,
      [event.target.id]: event.target.value,
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
      <Form.Group controlId='password'>
        <Form.Label>{textForKey('New password')}</Form.Label>
        <InputGroup>
          <Form.Control
            autoComplete='new-password'
            value={data.password || ''}
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
            autoComplete='new-password'
            value={data.confirmPassword || ''}
            type='password'
            onChange={handleFormChange}
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

export default SecuritySettings;
