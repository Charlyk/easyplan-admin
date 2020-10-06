import React from 'react';

import { Button, Form, InputGroup } from 'react-bootstrap';

import IconRefresh from '../../../../assets/icons/iconRefresh';
import { textForKey } from '../../../../utils/localization';

const PatientsFilter = props => {
  return (
    <div className='patients-filter'>
      <Form.Group controlId='firstName'>
        <Form.Label>{textForKey('Patient')}</Form.Label>
        <InputGroup>
          <Form.Control type='text' />
        </InputGroup>
      </Form.Group>
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>{textForKey('Sex')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          custom
        >
          <option value='all'>{textForKey('All')}</option>
          <option value='male'>{textForKey('Male')}</option>
          <option value='female'>{textForKey('Female')}</option>
          <option value='other'>{textForKey('Other')}</option>
        </Form.Control>
      </Form.Group>
      <Button className='positive-button'>
        {textForKey('Update')} <IconRefresh />
      </Button>
    </div>
  );
};

export default PatientsFilter;
