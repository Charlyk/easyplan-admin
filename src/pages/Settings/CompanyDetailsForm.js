import React from 'react';

import { Form, InputGroup } from 'react-bootstrap';

import { textForKey } from '../../utils/localization';

const CompanyDetailsForm = props => {
  return (
    <div className='company-details-form'>
      <div className='left'>
        <span className='form-title'>Company details</span>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('Company name')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('Email')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('Phone number')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('Website')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
      </div>
      <div className='right'>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('Social networks')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('Currency')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('Country')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
        <Form.Group controlId='website'>
          <Form.Label>{textForKey('About company')}</Form.Label>
          <InputGroup>
            <Form.Control type='text' />
          </InputGroup>
        </Form.Group>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
