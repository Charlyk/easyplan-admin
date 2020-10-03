import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Form, Image, InputGroup } from 'react-bootstrap';

import IconAvatar from '../../../assets/icons/iconAvatar';
import LoadingButton from '../../../components/LoadingButton';
import { urlToLambda } from '../../../utils/helperFuncs';
import { textForKey } from '../../../utils/localization';

const RegisterForm = ({ onGoBack }) => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    avatarFile: null,
  });

  const handleFormChange = event => {};

  const handleAvatarChange = event => {
    const files = event.target.files;
    if (files != null) {
      setData({ ...data, avatarFile: files[0] });
    }
  };

  const avatarSrc =
    data.avatarFile && window.URL.createObjectURL(data.avatarFile);

  return (
    <div className='form-root register-form'>
      <span className='form-title'>{textForKey('Create new account')}</span>
      <Form.Group controlId='firstName'>
        <Form.Label>{textForKey('First name')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={data.firstName}
            type='text'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='lastName'>
        <Form.Label>{textForKey('Last name')}</Form.Label>
        <InputGroup>
          <Form.Control
            value={data.lastName}
            type='text'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='email'>
        <Form.Label>{textForKey('Email')}</Form.Label>
        <InputGroup>
          <Form.Control
            autoComplete='new-email'
            value={data.email}
            type='email'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>{textForKey('Password')}</Form.Label>
        <InputGroup>
          <Form.Control
            autoComplete='new-password'
            value={data.password}
            type='password'
            onChange={handleFormChange}
          />
        </InputGroup>
      </Form.Group>
      <div className='avatar-container'>
        {avatarSrc ? <Image roundedCircle src={avatarSrc} /> : <IconAvatar />}
        <span style={{ margin: '1rem' }}>
          {textForKey('JPG or PNG, Max size of 800kb')}
        </span>
        <Form.Group>
          <input
            className='custom-file-button'
            type='file'
            name='x-ray-file'
            id='x-ray-file'
            accept='.jpg,.jpeg,.png'
            onChange={handleAvatarChange}
          />
          <label htmlFor='x-ray-file'>{textForKey('Upload image')}</label>
        </Form.Group>
      </div>
      <div className='footer'>
        <div
          role='button'
          tabIndex={0}
          className='back-button'
          onClick={onGoBack}
        >
          {textForKey('Already have an account?')}
        </div>
        <LoadingButton className='positive-button'>
          {textForKey('Create new account')}
        </LoadingButton>
      </div>
    </div>
  );
};

export default RegisterForm;

RegisterForm.propTypes = {
  onGoBack: PropTypes.func,
};
