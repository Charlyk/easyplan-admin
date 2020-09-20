import React from 'react';

import { Form, InputGroup } from 'react-bootstrap';

import { textForKey } from '../../../../utils/localization';
import CalendarDoctor from './CalendarDoctor';

const CalendarDoctors = props => {
  return (
    <div className='calendar-root__doctors'>
      <div className='doctors-header'>Doctors</div>
      <div className='doctors-search'>
        <Form.Group controlId='firstName'>
          <InputGroup>
            <Form.Control
              placeholder={`${textForKey('Search')}...`}
              type='text'
            />
          </InputGroup>
        </Form.Group>
      </div>
      <div className='doctors-content'>
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
        <CalendarDoctor />
      </div>
    </div>
  );
};

export default CalendarDoctors;
