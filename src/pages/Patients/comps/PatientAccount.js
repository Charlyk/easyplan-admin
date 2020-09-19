import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Button, Form, Image, InputGroup } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';

import IconAvatar from '../../../assets/icons/iconAvatar';
import IconSuccess from '../../../assets/icons/iconSuccess';
import IconTrash from '../../../assets/icons/iconTrash';
import LoadingButton from '../../../components/LoadingButton';
import { EmailRegex } from '../../../utils/constants';
import { textForKey } from '../../../utils/localization';

const PatientAccount = ({ patient }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <div className='patients-root__account'>
      <div className='patients-root__account__content'>
        <div className='patients-root__account__avatar-container'>
          {patient ? <Image roundedCircle /> : <IconAvatar />}
        </div>
        <div className='patients-root__account__data-form'>
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
              <PhoneInput
                displayInitialValueAsLocalNumber
                defaultCountry='MD'
                placeholder='079123456'
              />
            </InputGroup>
          </Form.Group>
        </div>
        <div className='patients-root__account__actions'>
          <Button className='delete-button' showLoading={isSaving}>
            {textForKey('Delete')}
            {!isSaving && <IconTrash />}
          </Button>
          <LoadingButton className='positive-button' showLoading={isSaving}>
            {textForKey('Save')}
            {!isSaving && <IconSuccess />}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default PatientAccount;

PatientAccount.propTypes = {
  patient: PropTypes.object,
};
