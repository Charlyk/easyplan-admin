import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';

import IconAvatar from '../../assets/icons/iconAvatar';
import { textForKey } from '../../utils/localization';

const DoctorAccountForm = props => {
  const { show } = props;
  const classes = clsx('account-info', show ? 'expanded' : 'collapsed');
  return (
    <div className={classes}>
      <div className='account-info__avatar-container'>
        <IconAvatar />
        <span>{textForKey('JPG or PNG, Max size of 800kb')}</span>
        <Button variant='outline-primary'>{textForKey('Upload image')}</Button>
      </div>
      <div className='account-info__content'>
        <Form.Group controlId='firstName'>
          <Form.Label>{textForKey('First name')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='lastName'>
          <Form.Label>{textForKey('Last name')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control type='email' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='phoneNumber'>
          <Form.Label>{textForKey('Phone number')}</Form.Label>
          <InputGroup>
            <Form.Control type='tel' />
          </InputGroup>
        </Form.Group>
      </div>
    </div>
  );
};

export default DoctorAccountForm;

DoctorAccountForm.propTypes = {
  show: PropTypes.bool.isRequired,
};
