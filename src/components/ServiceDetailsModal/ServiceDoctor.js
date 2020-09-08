import React from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import SwitchButton from '../SwitchButton';

const ServiceDoctor = props => {
  const { selected, doctor, onToggle, onChange } = props;
  const { price, percentage } = doctor;

  const isPercentageDisabled = !selected || price.length > 0;
  const isPriceDisabled = !selected || percentage.length > 0;

  const handlePercentageChange = event => {
    let newValue = event.target.value;
    onChange({
      doctorId: doctor.doctorId,
      price: null,
      percentage: parseInt(newValue),
    });
  };

  const handlePriceChanged = event => {
    let newValue = event.target.value;
    onChange({
      doctorId: doctor.doctorId,
      price: parseFloat(newValue),
      percentage: null,
    });
  };

  const handleDoctorToggle = () => {
    onToggle(selected);
  };

  const textClasses = clsx(
    'service-doctor__text',
    selected ? 'selected' : 'default',
  );

  return (
    <div className='service-doctor'>
      <div className='service-doctor__name-and-switch'>
        <SwitchButton isChecked={selected} onChange={handleDoctorToggle} />
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
  doctor: PropTypes.shape({
    doctorName: PropTypes.string,
    doctorId: PropTypes.string,
    percentage: PropTypes.string,
    price: PropTypes.string,
  }),
  selected: PropTypes.bool,
  onToggle: PropTypes.func,
  onChange: PropTypes.func,
};

ServiceDoctor.defaultProps = {
  doctor: {
    doctorName: '',
    doctorId: '',
    percentage: '',
    price: '',
  },
  selected: false,
  onToggle: () => null,
};
