import React, { useEffect, useState } from 'react';

import { Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import IconAvatar from '../../../../components/icons/iconAvatar';
import IconSuccess from '../../../../components/icons/iconSuccess';
import LoadingButton from '../../../../components/LoadingButton';
import { setCurrentUser } from '../../../../redux/actions/actions';
import { userSelector } from '../../../../redux/selectors/rootSelector';
import authAPI from '../../../../utils/api/authAPI';
import { EmailRegex } from '../../../../utils/constants';
import { uploadFileToAWS, urlToLambda } from '../../../../utils/helperFuncs';
import { textForKey } from '../../../../utils/localization';
import authManager from '../../../../utils/settings/authManager';
import styles from './AccountSettings.module.scss'

const AccountSettings = () => {
  const currentUser = useSelector(userSelector);
  const dispatch = useDispatch();
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
  }, [currentUser]);

  useEffect(() => {
    const isChanged = data.email !== currentUser.email;
    if (!isChanged) {
      setData({ ...data, oldPassword: null });
    }
    setIsEmailChanged(isChanged);
  }, [data.email]);

  const handleLogoChange = (event) => {
    if (isLoading) return;
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, avatarFile: files[0] });
    }
  };

  const handleFormChange = (event) => {
    if (isLoading) return;
    setData({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handlePhoneChange = (value, _, event) => {
    if (isLoading) return;
    setData({
      ...data,
      phoneNumber: `+${value}`,
      isPhoneValid: !event.target?.classList.value.includes('invalid-number'),
    });
  };

  const submitForm = async () => {
    setIsLoading(true);
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

    const response = await authAPI.updateAccount(requestBody);
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

  const avatarSrc =
    (data.avatarFile && window.URL.createObjectURL(data.avatarFile)) ||
    (data.avatarUrl ? urlToLambda(data.avatarUrl, 64) : null);

  return (
    <div className={styles['account-settings']}>
      <span className={styles['form-title']}>{textForKey('Account settings')}</span>
      <div className={'upload-avatar-container'}>
        {avatarSrc ? <Image roundedCircle src={avatarSrc} /> : <IconAvatar />}
        <span style={{ margin: '1rem' }} className={styles['info-text']}>
          {textForKey('JPG or PNG, Max size of 800kb')}
        </span>
        <Form.Group>
          <input
            className='custom-file-button'
            type='file'
            name='avatar-file'
            id='avatar-file'
            accept='.jpg,.jpeg,.png'
            onChange={handleLogoChange}
          />
          <label htmlFor='avatar-file'>{textForKey('Upload image')}</label>
        </Form.Group>
      </div>
      <Form.Group controlId='lastName'>
        <Form.Label>{textForKey('Last name')}</Form.Label>
        <InputGroup>
          <Form.Control
            type='text'
            onChange={handleFormChange}
            value={data.lastName || ''}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='firstName'>
        <Form.Label>{textForKey('First name')}</Form.Label>
        <InputGroup>
          <Form.Control
            type='text'
            onChange={handleFormChange}
            value={data.firstName || ''}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='email'>
        <Form.Label>{textForKey('Email')}</Form.Label>
        <InputGroup>
          <Form.Control
            isValid={data.email?.match(EmailRegex)}
            type='text'
            onChange={handleFormChange}
            value={data.email || ''}
          />
        </InputGroup>
      </Form.Group>
      {isEmailChanged && (
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
      )}
      <Form.Group controlId='phoneNumber'>
        <Form.Label>{textForKey('Phone number')}</Form.Label>
        <InputGroup>
          <PhoneInput
            onChange={handlePhoneChange}
            value={data.phoneNumber || ''}
            alwaysDefaultMask
            countryCodeEditable={false}
            country='md'
            isValid={(inputNumber, country) => {
              const phoneNumber = inputNumber.replace(
                `${country.dialCode}`,
                '',
              );
              return phoneNumber.length === 0 || phoneNumber.length === 8;
            }}
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

export default AccountSettings;
