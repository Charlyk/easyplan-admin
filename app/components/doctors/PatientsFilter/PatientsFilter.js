import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Calendar } from 'react-date-range';
import * as locales from 'react-date-range/dist/locale';

import { clinicServicesSelector } from '../../../../redux/selectors/clinicSelector';
import { Statuses } from '../../../utils/constants';
import { getAppLanguage, textForKey } from '../../../../utils/localization';
import styles from './PatientsFilter.module.scss';

const PatientsFilter = (
  {
    selectedDate,
    currentClinic,
    viewMode,
    onNameChange,
    onServiceChange,
    onStatusChange,
    onDateChange,
    onViewModeChange,
  }
) => {
  const services = clinicServicesSelector(currentClinic)

  const sortedServices = useMemo(() => {
    return sortBy(services, item => item.name.toLowerCase())
  }, [services])

  return (
    <div className={styles['patients-filter']}>
      <Button
        variant='outline-primary'
        style={{ width: '100%', marginTop: '1.3rem' }}
        onClick={onViewModeChange}
      >
        {viewMode === 'day' ? textForKey('Week schedules') : textForKey('Day schedules')}
      </Button>
      <Form.Group controlId='patientName'>
        <Form.Label>{textForKey('Patient')}</Form.Label>
        <InputGroup>
          <Form.Control onChange={onNameChange} type='text'/>
        </InputGroup>
      </Form.Group>
      <Form.Group
        style={{ flexDirection: 'column' }}
        controlId='inlineFormCustomSelect'
      >
        <Form.Label>{textForKey('Service')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          onChange={onServiceChange}
          custom
        >
          <option value='all'>{textForKey('All services')}</option>
          {sortedServices.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group
        style={{ flexDirection: 'column' }}
        controlId='inlineFormCustomSelect'
      >
        <Form.Label>{textForKey('Appointment status')}</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          onChange={onStatusChange}
          custom
        >
          <option value='all'>{textForKey('All statuses')}</option>
          {Statuses.map((status) => (
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
  viewMode: PropTypes.oneOf(['day', 'week']),
  onNameChange: PropTypes.func,
  onDateChange: PropTypes.func,
  onServiceChange: PropTypes.func,
  onStatusChange: PropTypes.func,
  onViewModeChange: PropTypes.func,
};

PatientsFilter.defaultProps = {
  onDateChange: () => null,
  onNameChange: () => null,
  onViewModeChange: () => null,
  onServiceChange: () => null,
  onStatusChange: () => null,
  selectedDate: new Date(),
};
