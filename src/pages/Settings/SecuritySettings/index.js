import React, { useState } from 'react';

import { Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconSuccess from '../../../assets/icons/iconSuccess';
import LoadingButton from '../../../components/LoadingButton';
import { setCurrentUser } from '../../../redux/actions/actions';
import { userSelector } from '../../../redux/selectors/rootSelector';
import authAPI from '../../../utils/api/authAPI';
import { textForKey } from '../../../utils/localization';
import authManager from '../../../utils/settings/authManager';
import styles from './SecuritySettings.module.scss';

const SecuritySettings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector);
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
    const response = await authAPI.updateAccount({
      ...data,
      avatar: currentUser.avatar,
    });
    if (response.isError) {
      toast.error(textForKey(response.message));
    } else {
      authManager.setUserToken(response.data.token);
      setTimeout(() => {
        dispatch(setCurrentUser(response.data.user));
        toast.success(textForKey('Saved successfully'));
      }, 500);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
