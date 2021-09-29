import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import SwitchButton from '../../../../common/SwitchButton';
import styles from './DoctorServiceItem.module.scss';

const DoctorServiceItem = props => {
  const { service, selected, onSelected, doctorService } = props;
  const [price, setPrice] = useState('');
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    if (doctorService?.price) {
      setPrice(String(doctorService.price));
    }

    if (doctorService?.percentage) {
      setPercentage(String(doctorService.percentage));
    }
  }, [doctorService]);

  const handleServiceToggle = () => {
    onSelected(service, null, null, !selected);
  };

  const handlePercentageChange = event => {
    setPercentage(event.target.value);
    setPrice('');
    onSelected(service, null, parseInt(event.target.value), selected);
  };

  const handlePriceChange = event => {
    setPrice(event.target.value);
    setPercentage('');
    onSelected(service, parseFloat(event.target.value), null, selected);
  };

  const titleClasses = clsx(styles['service-title'], selected ? styles.selected : styles.default);

  return (
    <div className={styles.doctorService}>
      <SwitchButton isChecked={selected} onChange={handleServiceToggle} />
      <div className={titleClasses}>{service.name}</div>
      <div className={styles['doctorService__fields']}>
        <InputGroup>
          <Form.Control
            disabled={!selected || price.length > 0}
            className={styles['doctorService__field']}
            min='0'
            placeholder='%'
            type='number'
            value={percentage}
            onChange={handlePercentageChange}
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>%</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <InputGroup>
          <Form.Control
            disabled={!selected || percentage.length > 0}
            className={styles['doctorService__field']}
            min='0'
            type='number'
            placeholder='$'
            value={price}
            onChange={handlePriceChange}
          />
          <InputGroup.Append>
            <InputGroup.Text id='basic-addon1'>mdl</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

export default DoctorServiceItem;

DoctorServiceItem.propTypes = {
  selected: PropTypes.bool,
  onSelected: PropTypes.func,
  doctorService: PropTypes.shape({
    id: PropTypes.number,
    price: PropTypes.number,
    percentage: PropTypes.number,
  }),
  service: PropTypes.shape({
    color: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
  }),
};
