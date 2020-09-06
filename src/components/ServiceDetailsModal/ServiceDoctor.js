import React, { useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import SwitchButton from '../SwitchButton';

const ServiceDoctor = props => {
  const { selected, onToggle } = props;
  const [isSelected, setIsSelected] = useState(selected);

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
      <SwitchButton isChecked={isSelected} onChange={handleDoctorToggle} />
      <div className={textClasses}>Doctor Name</div>
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
