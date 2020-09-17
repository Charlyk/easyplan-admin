import React, { useRef } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';

import IconAvatar from '../../assets/icons/iconAvatar';
import { textForKey } from '../../utils/localization';

const DoctorAccountForm = props => {
  const fileRef = useRef(null);
  const { data, onChange, show } = props;

  const handleFormChange = event => {
    onChange({
      ...data,
      [event.target.id]: event.target.value,
    });
  };

  const handlePhoneChanged = newValue => {
    console.log(newValue);
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
  const classes = clsx('account-info', show ? 'expanded' : 'collapsed');
  return (
    <div className={classes}>
      <div className='account-info__avatar-container'>
        {data.avatarFile || data.avatar ? (
          <Image
            roundedCircle
            src={
              data.avatarFile
                ? window.URL.createObjectURL(data.avatarFile)
                : data.avatar
            }
          />
        ) : (
          <IconAvatar />
        )}
        <span>{textForKey('JPG or PNG, Max size of 800kb')}</span>
        <Form.File id='doctor-avatar-input' custom>
          <Form.File.Input
            ref={fileRef}
            accept='.jpg,.jpeg,.png'
            onChange={handleAvatarChange}
          />
          <Form.File.Label data-browse={textForKey('Upload image')} />
        </Form.File>
      </div>
      <div className='account-info__content'>
        <Form.Group controlId='firstName'>
          <Form.Label>{textForKey('First name')}</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              onChange={handleFormChange}
              value={data.firstName}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='lastName'>
          <Form.Label>{textForKey('Last name')}</Form.Label>
          <InputGroup>
            <Form.Control
              type='text'
              onChange={handleFormChange}
              value={data.lastName}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control
              type='email'
              onChange={handleFormChange}
              value={data.email}
            />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='phoneNumber'>
          <Form.Label>{textForKey('Phone number')}</Form.Label>
          <InputGroup>
            <PhoneInput
              defaultCountry='MD'
              displayInitialValueAsLocalNumber
              value={data?.phoneNumber || ''}
              placeholder='079123456'
              onChange={handlePhoneChanged}
            />
          </InputGroup>
        </Form.Group>
      </div>
    </div>
  );
};

export default DoctorAccountForm;

DoctorAccountForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    avatarFile: PropTypes.object,
    avatar: PropTypes.string,
  }).isRequired,
};

DoctorAccountForm.defaultProps = {
  onChange: () => null,
  data: {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatarFile: null,
    avatar: null,
  },
};
