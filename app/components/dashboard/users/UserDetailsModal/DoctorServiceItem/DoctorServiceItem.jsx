import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import EASTextField from 'app/components/common/EASTextField';
import SwitchButton from 'app/components/common/SwitchButton';
import styles from './DoctorServiceItem.module.scss';

const DoctorServiceItem = (props) => {
  const { service, selected, onSelected, doctorService, clinicCurrency } =
    props;
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

  const handlePercentageChange = (newValue) => {
    setPercentage(newValue);
    setPrice('');
    onSelected(service, null, parseInt(newValue), selected);
  };

  const handlePriceChange = (newValue) => {
    setPrice(newValue);
    setPercentage('');
    onSelected(service, parseFloat(newValue), null, selected);
  };

  const titleClasses = clsx(
    styles.serviceTitle,
    selected ? styles.selected : styles.default,
  );

  return (
    <div className={styles.doctorService}>
      <SwitchButton isChecked={selected} onChange={handleServiceToggle} />
      <div className={titleClasses}>{service.name}</div>
      <div className={styles.fields}>
        <EASTextField
          type='number'
          placeholder='0'
          value={percentage}
          containerClass={styles.field}
          readOnly={!selected || price.length > 0}
          onChange={handlePercentageChange}
          endAdornment={<Typography className={styles.adornment}>%</Typography>}
        />

        <EASTextField
          type='number'
          placeholder='0'
          value={price}
          readOnly={!selected || percentage.length > 0}
          onChange={handlePriceChange}
          endAdornment={
            <Typography className={styles.adornment}>
              {clinicCurrency || 'MDL'}
            </Typography>
          }
        />
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
