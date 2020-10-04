import React, { useEffect, useState } from 'react';

import { Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';

import IconAvatar from '../../assets/icons/iconAvatar';
import IconSuccess from '../../assets/icons/iconSuccess';
import LoadingButton from '../../components/LoadingButton';
import { userSelector } from '../../redux/selectors/rootSelector';
import { EmailRegex } from '../../utils/constants';
import { urlToLambda } from '../../utils/helperFuncs';
import { textForKey } from '../../utils/localization';

const AccountSettings = props => {
  const currenUser = useSelector(userSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    avatarUrl: currenUser.avatar,
    avatarFile: null,
    firstName: currenUser.firstName,
    lastName: currenUser.lastName,
    email: currenUser.username,
    phoneNumber: currenUser.phoneNumber,
  });

  useEffect(() => {
    setData({ ...data, ...currenUser });
  }, [currenUser]);

  const handleLogoChange = event => {
    if (isLoading) return;
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, avatarFile: files[0] });
    }
  };

  const handleFormChange = event => {
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

  const submitForm = () => {};

  const avatarSrc =
    (data.avatarFile && window.URL.createObjectURL(data.avatarFile)) ||
    (data.avatarUrl ? urlToLambda(data.avatarUrl, 64) : null);

  return (
    <div className='account-settings'>
      <div className='upload-avatar-container'>
        {avatarSrc ? <Image roundedCircle src={avatarSrc} /> : <IconAvatar />}
        <span style={{ margin: '1rem' }} className='info-text'>
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
        disabled={isLoading}
      >
        {textForKey('Save')}
        {!isLoading && <IconSuccess />}
      </LoadingButton>
    </div>
  );
};

export default AccountSettings;
