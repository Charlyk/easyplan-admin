import React from 'react';

import { Form, InputGroup } from 'react-bootstrap';

import { textForKey } from '../../../../utils/localization';

const ServicesFilter = props => {
  return (
    <div className='calendar-root__services'>
      <Form.Group controlId='searchQuery'>
        <Form.Label>{textForKey('Services')}</Form.Label>
        <InputGroup>
          <Form.Control type='text' />
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default ServicesFilter;
