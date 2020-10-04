import React from 'react';

import { Form, InputGroup } from 'react-bootstrap';

import LoadingButton from '../../../../components/LoadingButton';
import { textForKey } from '../../../../utils/localization';

const ServicesStatistics = props => {
  return (
    <div className='statistics-services'>
      <div className='filter'>
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>Services</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            custom
          >
            <option value='choose'>{textForKey('All components')}</option>
          </Form.Control>
        </Form.Group>
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>Services</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            custom
          >
            <option value='choose'>{textForKey('All components')}</option>
          </Form.Control>
        </Form.Group>
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>Services</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            custom
          >
            <option value='choose'>{textForKey('All components')}</option>
          </Form.Control>
        </Form.Group>
        <Form.Group style={{ flexDirection: 'column' }}>
          <Form.Label>Services</Form.Label>
          <Form.Control
            as='select'
            className='mr-sm-2'
            id='inlineFormCustomSelect'
            custom
          >
            <option value='choose'>{textForKey('All components')}</option>
          </Form.Control>
        </Form.Group>
        <LoadingButton className='positive-button'>
          {textForKey('Apply filters')}
        </LoadingButton>
      </div>
    </div>
  );
};

export default ServicesStatistics;
