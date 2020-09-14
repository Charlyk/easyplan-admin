import React from 'react';

import { Button, Form, InputGroup } from 'react-bootstrap';

import IconAvatar from '../../assets/icons/iconAvatar';
import { textForKey } from '../../utils/localization';

const ReceptionForm = props => {
  return (
    <div className='reception-form'>
      <div className='reception-form__title'>
        {textForKey('Account information')}
      </div>
      <div className='reception-form__avatar-container'>
        <IconAvatar />
        <span>JPG or PNG, Max size of 800kb</span>
        <Button variant='outline-primary'>{textForKey('Upload image')}</Button>
      </div>
      <div className='reception-form__content'>
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

export default ReceptionForm;
