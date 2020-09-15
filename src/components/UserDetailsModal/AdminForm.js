import React, { useRef } from 'react';

import PropTypes from 'prop-types';
import { Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';

import IconAvatar from '../../assets/icons/iconAvatar';
import { EmailRegex } from '../../utils/constants';
import { textForKey } from '../../utils/localization';

const AdminForm = props => {
  const fileRef = useRef(null);
  const { data, onChange } = props;

  const handleFormChange = event => {
    onChange({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handlePhoneChanged = newValue => {
    onChange({
      ...data,
      phoneNumber: newValue,
    });
  };

  const handleAvatarChange = event => {
    const { files } = event.target;
    if (files.length > 0) {
      onChange({
        ...data,
        avatarFile: files[0],
      });
    }
  };

  return (
    <div className='admin-form'>
      <div className='admin-form__title'>
        {textForKey('Account information')}
      </div>
      <div className='admin-form__avatar-container'>
        {data.avatarFile ? (
          <Image
            roundedCircle
            src={window.URL.createObjectURL(data.avatarFile)}
          />
        ) : (
          <IconAvatar />
        )}
        <span style={{ margin: '1rem' }}>
          {textForKey('JPG or PNG, Max size of 800kb')}
        </span>
        <Form.File id='admin-avatar-input' custom>
          <Form.File.Input
            ref={fileRef}
            accept='.jpg,.jpeg,.png'
            onChange={handleAvatarChange}
          />
          <Form.File.Label data-browse={textForKey('Upload image')} />
        </Form.File>
      </div>
      <div className='admin-form__content'>
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
              isInvalid={data.email.length > 0 && !data.email.match(EmailRegex)}
              value={data.email}
              type='email'
              onChange={handleFormChange}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='phoneNumber'>
          <Form.Label>{textForKey('Phone number')}</Form.Label>
          <InputGroup>
            <PhoneInput
              defaultCountry='MD'
              placeholder='079123456'
              value={data.phoneNumber}
              onChange={handlePhoneChanged}
            />
          </InputGroup>
        </Form.Group>
      </div>
    </div>
  );
};

export default AdminForm;

AdminForm.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    avatarFile: PropTypes.object,
  }).isRequired,
};

AdminForm.defaultProps = {
  onChange: () => null,
  data: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatarFile: null,
  },
};
