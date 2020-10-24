import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import IconRefresh from '../../../../assets/icons/iconRefresh';
import dataAPI from '../../../../utils/api/dataAPI';
import { ScheduleStatuses } from '../../../../utils/constants';
import { getAppLanguage, textForKey } from '../../../../utils/localization';

const PatientsFilter = ({
  selectedDate,
  onNameChange,
  onServiceChange,
  onStatusChange,
  onDateChange,
}) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const response = await dataAPI.fetchUserServices();
    if (response.isError) {
      console.error(response.message);
    } else {
      setServices(response.data);
    }
  };

  return (
    <div className='patients-filter'>
      <Form.Group controlId='patientName'>
        <Form.Label>{textForKey('Patient')}</Form.Label>
        <InputGroup>
          <Form.Control onChange={onNameChange} type='text' />
        </InputGroup>
      </Form.Group>
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>{textForKey('Service')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          onChange={onServiceChange}
          custom
        >
          <option value='all'>{textForKey('All services')}</option>
          {services.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>{textForKey('Appointment status')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          onChange={onStatusChange}
          custom
        >
          <option value='all'>{textForKey('All statuses')}</option>
          {ScheduleStatuses.map(status => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Calendar
        locale={locales[getAppLanguage()]}
        onChange={onDateChange}
        date={selectedDate}
      />
    </div>
  );
};

export default PatientsFilter;

PatientsFilter.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onNameChange: PropTypes.func,
  onDateChange: PropTypes.func,
  onServiceChange: PropTypes.func,
  onStatusChange: PropTypes.func,
};

PatientsFilter.defaultProps = {
  onDateChange: () => null,
  onNameChange: () => null,
  onServiceChange: () => null,
  onStatusChange: () => null,
  selectedDate: new Date(),
};
