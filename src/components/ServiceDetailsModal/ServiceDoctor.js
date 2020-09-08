import React, { useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import { textForKey } from '../../utils/localization';
import SwitchButton from '../SwitchButton';

const ServiceDoctor = props => {
  const { selected, onToggle } = props;
  const [isSelected, setIsSelected] = useState(selected);
  const [percentage, setPercentage] = useState('');
  const [price, setPrice] = useState('');

  const isPercentageDisabled = !isSelected || price.length > 0;
  const isPriceDisabled = !isSelected || percentage.length > 0;

  const handlePercentageChange = event => {
    let newValue = event.target.value;
    if (newValue.length > 0 && parseInt(newValue) < 0) newValue = '0';
    setPercentage(newValue);
  };

  const handlePriceChanged = event => {
    let newValue = event.target.value;
    if (newValue.length > 0 && parseFloat(newValue) < 0) newValue = '0';
    setPrice(newValue);
  };

  const handleDoctorToggle = () => {
    setIsSelected(!isSelected);
    onToggle(isSelected);
  };

  const textClasses = clsx(
    'service-doctor__text',
    isSelected ? 'selected' : 'default',
  );

  return (
    <div className='service-doctor'>
      <div className='service-doctor__name-and-switch'>
        <SwitchButton isChecked={isSelected} onChange={handleDoctorToggle} />
        <div className={textClasses}>Doctor Name</div>
      </div>
      <div className='service-doctor__fields'>
        <InputGroup>
          <Form.Control
            onChange={handlePercentageChange}
            disabled={isPercentageDisabled}
            className='service-doctor__field'
            min='0'
            placeholder='%'
            type='number'
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>mdl</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup>
          <Form.Control
            onChange={handlePriceChanged}
            disabled={isPriceDisabled}
            className='service-doctor__field'
            min='0'
            type='number'
            placeholder='$'
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>mdl</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

export default ServiceDoctor;

ServiceDoctor.propTypes = {
  selected: PropTypes.bool,
  onToggle: PropTypes.func,
};

ServiceDoctor.defaultProps = {
  selected: false,
  onToggle: () => null,
};
