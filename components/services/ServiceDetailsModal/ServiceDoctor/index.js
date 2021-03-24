import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';

import SwitchButton from '../../../common/SwitchButton';
import styles from '../../../../styles/ServiceDoctor.module.scss';

const ServiceDoctor = ({ serviceData, onChange }) => {
  const [doctorService, setDoctorService] = useState({
    selected: false,
    doctorName: '',
    doctorId: null,
    price: '',
    percentage: '',
  });

  useEffect(() => {
    if (serviceData != null) {
      setDoctorService({
        ...serviceData,
        price: serviceData.price ? String(serviceData.price) : '',
        percentage: serviceData.percentage
          ? String(serviceData.percentage)
          : '',
      });
    }
  }, [serviceData]);

  const handlePercentageChange = event => {
    let newValue = event.target.value;
    onChange({
      ...doctorService,
      price: null,
      percentage: parseInt(newValue),
    });
  };

  const handlePriceChanged = event => {
    let newValue = event.target.value;
    onChange({
      ...doctorService,
      price: parseFloat(newValue),
      percentage: null,
    });
  };

  const handleDoctorToggle = () => {
    const isSelected = !doctorService.selected;
    onChange({
      ...doctorService,
      price: isSelected ? parseFloat(doctorService.price) : null,
      percentage: isSelected ? parseInt(doctorService.percentage) : null,
      selected: isSelected,
    });
  };

  const textClasses = clsx(
    styles['service-doctor__text'],
    doctorService.selected ? styles.selected : styles.default,
  );

  const isPercentageDisabled =
    !doctorService.selected || doctorService.price.length > 0;
  const isPriceDisabled =
    !doctorService.selected || doctorService.percentage.length > 0;

  return (
    <div className={styles['service-doctor']}>
      <div className={styles['service-doctor__name-and-switch']}>
        <SwitchButton
          isChecked={doctorService.selected}
          onChange={handleDoctorToggle}
        />
        <div className={textClasses}>{doctorService.doctorName}</div>
      </div>
      <div className={styles['service-doctor__fields']}>
        <InputGroup>
          <Form.Control
            value={String(doctorService.percentage)}
            onChange={handlePercentageChange}
            disabled={isPercentageDisabled}
            className={styles['service-doctor__field']}
            min='0'
            placeholder='%'
            type='number'
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>%</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup>
          <Form.Control
            value={String(doctorService.price)}
            onChange={handlePriceChanged}
            disabled={isPriceDisabled}
            className={styles['service-doctor__field']}
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
  serviceData: PropTypes.shape({
    doctorName: PropTypes.string,
    doctorId: PropTypes.number,
    percentage: PropTypes.number,
    price: PropTypes.number,
    selected: PropTypes.bool,
  }),
  onChange: PropTypes.func,
};

ServiceDoctor.defaultProps = {
  onChange: () => null,
};
