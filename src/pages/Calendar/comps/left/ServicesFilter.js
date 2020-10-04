import React from 'react';

import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

import { textForKey } from '../../../../utils/localization';

const ServicesFilter = ({ services, selectedService, onSelect }) => {
  const handleServiceSelected = event => {
    const newValue = event.target.value;
    const service = services.find(item => item.id === newValue);
    onSelect(service);
  };

  return (
    <div className='calendar-root__services'>
      <Form.Group style={{ flexDirection: 'column' }}>
        <Form.Label>Services</Form.Label>
        <Form.Control
          as='select'
          className='mr-sm-2'
          id='inlineFormCustomSelect'
          custom
          onChange={handleServiceSelected}
          value={selectedService?.id}
        >
          <option value='choose'>{textForKey('All services')}</option>
          {services.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </div>
  );
};

export default ServicesFilter;

ServicesFilter.propTypes = {
  services: PropTypes.arrayOf(PropTypes.object),
  selectedService: PropTypes.object,
  onSelect: PropTypes.func,
};

ServicesFilter.defaultProps = {
  services: [],
  onSelect: () => null,
};
